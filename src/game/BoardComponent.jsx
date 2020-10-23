import React, { useEffect, useState } from "react"
import { last, range } from "../helpers/dataHelpers"
import { checkEatTarget, generateGrid, dPattern, gapPattern, generateFoodPosition, getMoveExcept, patternToString, indexOfPattern, isEqualPattern, checkOutsideBoardSize, dfsStepNode, optimationStep, getRotate } from "../helpers/gameSnakeHelpers"
import { ReactComponent as StartNodeIcon } from "../images/startNode.svg"
import * as appStateAction from "../stores/actions/appStateAction"
import * as gameBusinessAction from "../stores/actions/business/gameBusinessAction"
import * as gameStateAction from "../stores/actions/gameStateAction"
import { batch, connect } from "react-redux"
import { bindActionCreators } from "redux"
import "./BoardComponent.scss"
import GameEnums from "../enums/gameEnums"
import { runningProcessStep } from "../helpers/intervalHelpers"
import TargetItem from "./TargetItem"

const mapStateToProps = (state) => {
    return {
        areaSearch: state.gameState.areaSearch,
        boardSize: state.gameState.boardSize,
        foodPosition: state.gameState.foodPosition,
        optimizePath: state.gameState.optimizePath,
        snakePosition: state.gameState.snakePosition,
        startGame: state.appState.startGame,
        wallPosition: state.gameState.wallPosition,
        visualizeFinding: state.gameState.visualizeFinding,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        appStateAction: bindActionCreators(appStateAction, dispatch),
        gameBusinessAction: bindActionCreators(gameBusinessAction, dispatch),
        gameStateAction: bindActionCreators(gameStateAction, dispatch),
    }
}

const BoardComponent = (props) => {
    const [boardSize, setBoardSize] = useState(props.boardSize)
    const timerInterval = props.timerInterval
    const [history, setHistory] = useState([])
    const [levelEat, setLevelEat] = useState(0)
    const styleBoardContainer = Object.assign(generateGrid(boardSize), {width: window.screen.height + "px"})
    const [mouseDownActive, setMouseDownActive] = useState(false)
    const [mouseDownType, setMouseDownType] = useState(GameEnums.SET_WALL)

    const [areaSearch, setAreaSearch] = useState(props.areaSearch)
    const [snakePosition, setSnakePosition] = useState(props.snakePosition)

    const [foodPosition, setFoodPosition] = useState(props.foodPosition)
    const [wallPosition, setWallPosition] = useState(props.wallPosition)
    const areaSearchForRender = [...areaSearch]
    const snakePositionForRender = [...snakePosition]
    const wallPositionForRender = [...wallPosition]
    const debug = false

    useEffect(() => {
        const { appStateAction } = props
        let obj = {
            startGame: true,
            historyAreaSearch: [],
            areaSearched: [],
            areaSearch: props.areaSearch,
            foodPosition: props.foodPosition,
            snakePosition: props.snakePosition,
            visualizeFinding: props.visualizeFinding,
        }
        if (props.startGame) {
            // const optimation = optimationStep(snakePosition, wallPosition)
            // setSnakePosition(optimation)
            // --------------------------------
            areaSearchStep(obj)
            const historyAreaSearch = [...obj.historyAreaSearch]
            obj.areaSearch = last(historyAreaSearch)
            let interval = setInterval(() => {
                if(historyAreaSearch.length <= 0) {
                    clearInterval(interval)
                    if (indexOfPattern(props.foodPosition, last(obj.historyAreaSearch)) >= 0) {
                        dfsStep(obj)
                    } else {
                        setAreaSearch([])
                        appStateAction.setStartGame(false)
                    }
                    return
                }
                let [ areaNext ] = historyAreaSearch
                historyAreaSearch.shift()
                setAreaSearch(areaNext)
            }, timerInterval)
        }
        
        return () => {
            obj.startGame = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.startGame, props.visualizeFinding, levelEat])

    useEffect(() => {
        if (!props.startGame) {
            setBoardSize(props.boardSize)
            setSnakePosition([dPattern])
            setFoodPosition(generateFoodPosition([...snakePosition, ...wallPosition], props.boardSize))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.boardSize])

    useEffect(() => {
        if (!props.startGame) {
            setAreaSearch(props.areaSearch)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.areaSearch])

    useEffect(() => {
        if (!props.startGame) {
            setFoodPosition(props.foodPosition)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.foodPosition])

    useEffect(() => {
        if (!props.startGame) {
            setWallPosition(props.wallPosition)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.wallPosition])

    useEffect(() => {
        if (!props.startGame) {
            setSnakePosition(props.snakePosition)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.snakePosition])


    const checkPositionSnake = ( positionX = 0, positionY = 0, result = 'active') => {
        if (snakePositionForRender.length === 0) return false
        let index = indexOfPattern({x: positionX, y: positionY}, snakePositionForRender)
        if (index !== -1) {
            // if (snakePosition[0].x === snakePositionForRender[index].x && snakePosition[0].y === snakePositionForRender[index].y)
            //     result =  result + 'Head'
            snakePositionForRender.splice(index, 1)
            return result
        } 

        return ""
    }

    const checkWallPosition = (positionX = 0, positionY = 0, result = 'wall') => {
        if (wallPositionForRender.length === 0) return false
        let index = indexOfPattern({x: positionX, y: positionY}, wallPositionForRender)
        if (index !== -1) {
            wallPositionForRender.splice(index, 1)
            return result
        }

        return ""
    }

    const checkAreaSearch = (positionX = 0, positionY = 0, result = 'areaSearch') => {
        if (areaSearchForRender.length === 0) return false
        let index = indexOfPattern({x: positionX, y: positionY}, areaSearchForRender)
        if (index !== -1) {
            areaSearchForRender.splice(index, 1)
            return result
        }

        return ""
    }

    const areaSearchStep = (data, deepLevel = 0) => {
        
        let areaSearchOriginal = data.areaSearch.length === 0 ? [snakePosition[0]] : [...data.areaSearch]
        let areaSearchTemp = [...areaSearchOriginal]
        let nextSearch
        let currentPosition
        let historyAreaSearch = []
        let visited = data.visited ? data.visited : []
        historyAreaSearch.push(areaSearchTemp)
        let newAreaSearch = []
        for(let i = 0; i < areaSearchOriginal.length; i ++) {
            nextSearch = true
            currentPosition = patternToString(areaSearchOriginal[i])
            if(!visited[currentPosition]) visited[currentPosition] = []
            while(nextSearch) {
                if (visited[currentPosition] && visited[currentPosition].length >= 4) {
                    nextSearch = null
                    continue
                }
                
                nextSearch = getMoveExcept(visited[currentPosition], areaSearchOriginal[i], boardSize)
                visited[currentPosition].push(nextSearch)
                if (nextSearch && indexOfPattern(nextSearch, areaSearchTemp) === -1) {
                    areaSearchTemp.push(Object.assign({}, nextSearch))
                    newAreaSearch.push(Object.assign({}, nextSearch))
                    historyAreaSearch.push([...areaSearchTemp].map((item) => Object.assign({}, item)))
                }
            }
        }

        let areaSearched = data.areaSearched ? [...data.areaSearched] : []
        let obstacle = [snakePosition[0], ...areaSearched, ...wallPosition]
        newAreaSearch = newAreaSearch.filter((item) => indexOfPattern(item, obstacle) === -1)
        
        areaSearched = [...areaSearched, ...newAreaSearch]
        if (newAreaSearch.length > 0) {
            data.areaSearched = [...areaSearched].map((item) => Object.assign({}, item))
            data.areaSearch = [...newAreaSearch].map((item) => Object.assign({}, item))
            data.visited = [...visited].map((item) => Object.assign({}, item))
            data.historyAreaSearch.push(areaSearched)
            if (indexOfPattern(props.foodPosition, areaSearched) === -1)
                areaSearchStep(data, deepLevel + 1)
        }
    }

    const dfsStep = (data) => {
        let interval
        let step = []
        let visited = []
        let move = dPattern
        let moveAll = []
        let snakePositionTemp = data.snakePosition.map((item) => Object.assign({}, item))
        let snakePositionOriginal = data.snakePosition.map((item) => Object.assign({}, item))
        let foodPositionTemp = {...foodPosition}
        let historyTemp = [...history]
        let eatFood = false
        let nextStep
        let allStep = []
        let currentPosition 
        let index = -1
        // ----------------------------------------------------

        const setVisited = (data) => visited = data

        const prevStep = (r = 0) => {
            snakePositionTemp.shift()
            step.pop()
            allStep.push([...step].reverse().map((item) => Object.assign({}, item, {c: r})))
        }

        while (!eatFood) {
            index ++
            let [ headNode ] = snakePositionTemp
            currentPosition = patternToString(headNode)

            nextStep = dfsStepNode(visited, currentPosition, foodPosition, [...wallPosition], snakePositionTemp.map((item) => Object.assign({}, item)), boardSize, prevStep, setVisited)
            if (nextStep === GameEnums.CONTINUE) continue

            visited[currentPosition].push(Object.assign({}, nextStep))
            
            if (indexOfPattern(nextStep, [...wallPosition, ...snakePositionTemp]) >= 0 || indexOfPattern(nextStep, [...data.areaSearch]) === -1 ||  checkOutsideBoardSize(Object.assign({}, nextStep), boardSize)) {
                continue
            }
            move = gapPattern(Object.assign({}, headNode), Object.assign({}, nextStep))
            moveAll.push(Object.assign({}, move))
            step.push(Object.assign({}, nextStep))
            allStep.push([...step].reverse().map((item) => Object.assign({}, item)))
            snakePositionTemp = [Object.assign({}, nextStep), ...snakePositionTemp]
            
            if (checkEatTarget(snakePositionTemp, foodPositionTemp)) {
                if (props.optimizePath) {
                    const optimation = optimationStep([snakePosition[0], ...step], wallPosition)
                    step = [...optimation]
                    allStep.push([...optimation])
                }
                eatFood = true
                continue
            }
        }

        const { appStateAction, gameStateAction } = props

        const setDefault = () => {
            const newSnake = [...snakePositionOriginal]
            const newFood = {...foodPositionTemp}
            if (historyTemp.length > 5) historyTemp.shift()
            setHistory([...historyTemp, {
                snakePosition: newSnake,
                foodPosition: newFood,
                wallPosition: props.wallPosition,
            }])

            if (debug)
            console.log(`history`, JSON.stringify(historyTemp))
            setSnakePosition(newSnake)
            setFoodPosition(newFood)
            gameStateAction.setSnakePosition(newSnake)
            gameStateAction.setFoodPosition(newFood)
            // setLevelEat(levelEat + 1)
        }

        const log = () => {
            clearInterval(interval)
            setDefault()
            if (debug)
            console.log("snakePosition", JSON.stringify([...snakePositionOriginal]), 'food', JSON.stringify(foodPositionTemp), 'wall', JSON.stringify(props.wallPosition))
            return 
        }
        
        const onDone = () => appStateAction.setStartGame(false)

        if(data.visualizeFinding)
            runningProcessStep(data, snakePositionOriginal, log, onDone, () => {}, allStep, (movingNext) => { return movingNext }, setSnakePosition, timerInterval)
        else
            runningProcessStep(data, [], log, onDone, () => {}, step, (movingNext, data1) => { return [movingNext, ...data1] }, setSnakePosition, timerInterval)

        index = 0
    }

    const setWallActive = (e, value, positionX, positionY) => {
        const { gameStateAction } = props
        e.preventDefault()
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if (isEqualPattern(snakePosition[0], {x: positionX, y: positionY})) {
            setMouseDownType(GameEnums.DRAG_NODE)
        } else if (isEqualPattern(foodPosition, {x: positionX, y: positionY})) {
            setMouseDownType(GameEnums.DRAG_TARGET)
        } else {
            setMouseDownType(GameEnums.SET_WALL)
        }
        if (!value) {
            batch(() => {
                gameStateAction.setFoodPosition(foodPosition)
                gameStateAction.setSnakePosition(snakePosition)
                gameStateAction.setWallPosition(wallPosition)
            })
        }

        if (value === 'check') {
            setMouseDownActive(true)
            addOrRemoveWall(positionX, positionY, true)
        }
        else 
            setMouseDownActive(value)
    }

    const addOrRemoveWall = (positionX, positionY, forceActive = false) => {
        const { gameBusinessAction } = props
        if ((mouseDownActive || forceActive) && !props.startGame) {
            if (!isEqualPattern(snakePosition[0], {x: positionX, y: positionY}) && !isEqualPattern(foodPosition, {x: positionX, y: positionY})) {
                switch(mouseDownType) {
                    case GameEnums.DRAG_NODE:
                        setSnakePosition([{x: positionX, y: positionY}])
                        break
                    case GameEnums.SET_WALL:
                        setWallPosition(gameBusinessAction.addOrRemoveData({x: positionX, y: positionY}, wallPosition))
                        break
                    case GameEnums.DRAG_TARGET:
                        setFoodPosition({x: positionX, y: positionY})
                        break
                    default:
                        break
                }
            } 
        }
    }

    return (
        <div 
            className="board-component-container" 
            style={styleBoardContainer}
            onMouseDown={(e) => setWallActive(e, true)}
            onMouseUp={(e) => setWallActive(e, false)}
            tabIndex="0"
        >
            {range(boardSize).map((indexY) => {
                return range(boardSize).map((indexX) => {
                    return (
                        <div
                            key={`board-item-${indexX}-${indexY}`} 
                            onMouseEnter={() => addOrRemoveWall(indexX, indexY)}
                            onMouseDown={(e) => setWallActive(e, 'check', indexX, indexY)}
                            className={`board-item ${checkAreaSearch(indexX, indexY)} ${checkPositionSnake(indexX, indexY)}`}
                        >   
                            <div className={`board-item unborder ${checkWallPosition(indexX, indexY)}`}>
                                {/* {!isEqualPattern(snakePosition[0], {x: indexX, y: indexY}) && !isEqualPattern(last(snakePosition), {x: indexX, y: indexY}) && <React.Fragment>
                                <div>x: {indexX}</div>
                                <div>y: {indexY}</div>
                                </React.Fragment>} */}
                                
                                {isEqualPattern(snakePosition[0], {x: indexX, y: indexY}) && <div className="container-icon"><StartNodeIcon style={{transform: `rotate(${getRotate(snakePosition[1] || snakePosition[0], snakePosition[0])}deg)`}}/></div>}
                                {snakePosition.length > 1 && isEqualPattern(last(snakePosition), {x: indexX, y: indexY}) && <div className="container-icon"><StartNodeIcon/></div>}
                                {isEqualPattern(foodPosition, {x: indexX, y: indexY}) && !isEqualPattern(snakePosition[0], {x: indexX, y: indexY}) && <TargetItem/>}
                            </div>
                            
                            
                        </div>
                    )
                })
            })}
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(BoardComponent))
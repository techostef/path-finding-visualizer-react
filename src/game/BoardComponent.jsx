import React, { useEffect, useState } from "react"
import { last, range } from "../helpers/dataHelpers"
import { checkEatTarget, doEatFood, generateGrid, dPattern, gapPattern, followingHeader, checkEatBody, moveNext, generateFoodPosition, getMoveExcept, patternToString, indexOfPattern, followingTail, isEqualPattern, checkOutsideBoardSize } from "../helpers/gameSnakeHelpers"
import { ReactComponent as StartNodeIcon } from "../images/startNode.svg"
import * as appStateAction from "../stores/actions/appStateAction"
import * as gameBusinessAction from "../stores/actions/business/gameBusinessAction"
import * as gameStateAction from "../stores/actions/gameStateAction"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import "./BoardComponent.scss"
import GameEnums from "../enums/gameEnums"

const mapStateToProps = (state) => {
    return {
        boardSize: state.gameState.boardSize,
        foodPosition: state.gameState.foodPosition,
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

    const [snakePosition, setSnakePosition] = useState(props.snakePosition)

    const [foodPosition, setFoodPosition] = useState(props.foodPosition)
    const [wallPosition, setWallPosition] = useState(props.wallPosition)
    const snakePositionForRender = [...snakePosition]
    const wallPositionForRender = [...wallPosition]
    const debug = true
    useEffect(() => {
        let obj = {
            startGame: true,
            foodPosition: props.foodPosition,
            snakePosition: props.snakePosition,
            visualizeFinding: props.visualizeFinding,
        }
        if (props.startGame) {
            dfsStep(obj)
            // let snakePositionTemp = [...snakePosition]
            // let [ headSnake ] = snakePositionTemp
            // const setSnakePositionTemp = (data) => snakePositionTemp = data
            // followingHeader(headSnake, snakePositionTemp, boardSize, setSnakePositionTemp)
            // setSnakePosition([...snakePositionTemp])
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
        let check = false
        for (let i = 0; i < snakePositionForRender.length; i ++) {
            if (check !== false) break
            if (positionX === snakePositionForRender[i].x && positionY === snakePositionForRender[i].y) check = i
        }
        if (check !== false) {
            if (snakePosition[0].x === snakePositionForRender[check].x && snakePosition[0].y === snakePositionForRender[check].y)
                result =  result + 'Head'
            snakePositionForRender.splice(check, 1)
            return result
        } else {
            return ""
        }
    }

    const checkWallPosition = (positionX = 0, positionY = 0, result = 'wall') => {
        if (wallPositionForRender.length === 0) return false
        let check = false
        for (let i = 0; i < wallPositionForRender.length; i ++) {
            if (check !== false) break
            if (positionX === wallPositionForRender[i].x && positionY === wallPositionForRender[i].y) check = i
        }
        if (check !== false) {
            wallPositionForRender.splice(check, 1)
            return result
        } else {
            return ""
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
        let obstacle
        // ----------------------------------------------------

        const prevStep = (r = 0) => {
            snakePositionTemp.shift()
            step.pop()
            allStep.push([...step].reverse().map((item) => Object.assign({}, item, {c: r})))
        }

        while (!eatFood) {
            index ++
            let [ headNode ] = snakePositionTemp
            currentPosition = patternToString(headNode)
            // if (indexOfPattern({x: 12, y: 9}, snakePositionTemp) >= 0)
            //     console.log("nextStep 0.0", index, indexOfPattern({x: 12, y: 9}, snakePositionTemp))
            if (index === 58) 
                console.log([...snakePositionTemp].map((item) => Object.assign({}, item)))
            if (!visited[currentPosition]) {
                visited[currentPosition] = []
                obstacle = [...wallPosition, ...snakePositionTemp.map((item) => Object.assign({}, item))]
                nextStep = moveNext(headNode, foodPositionTemp, obstacle, boardSize)
                // if (debug)
                // console.log("nextStep 1", headNode, nextStep)
            } else {
                if (visited[currentPosition].length >= 4) {
                    prevStep(0)
                    continue
                }
                
                
                nextStep = getMoveExcept(visited[currentPosition], headNode, boardSize)

                obstacle = [...wallPosition, ...visited[currentPosition], ...snakePositionTemp.map((item) => Object.assign({}, item))]
              
                if (nextStep && indexOfPattern(Object.assign({}, nextStep), obstacle) >= 0) {
                    visited[currentPosition].push(Object.assign({}, nextStep))
                    continue
                }
                if (!nextStep) {
                    prevStep(index)
                    continue
                }
                // if (debug)
                // console.log("nextStep 2", headNode, nextStep)
            }

            visited[currentPosition].push(Object.assign({}, nextStep))
            
            if (indexOfPattern(nextStep, [...wallPosition]) >= 0 || checkOutsideBoardSize(Object.assign({}, nextStep), boardSize)) {
                continue
            }
            move = gapPattern(Object.assign({}, headNode), Object.assign({}, nextStep))
            moveAll.push(Object.assign({}, move))
            step.push(Object.assign({}, nextStep))
            allStep.push([...step].reverse().map((item) => Object.assign({}, item)))
            snakePositionTemp = [Object.assign({}, nextStep), ...snakePositionTemp]

            
            
            if (checkEatTarget(snakePositionTemp, foodPositionTemp)) {
                eatFood = true
                continue
            }
        }

        if (debug) {
            // console.log("step ?", JSON.stringify(step))
            // console.log("allStep ?", JSON.stringify(allStep))
            // console.log("snakePosition ?", JSON.stringify(snakePositionTemp))
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

        if(!data.visualizeFinding)
        interval = setInterval(() => {
            if (data.startGame === false) {
                clearInterval(interval)
                setDefault()
                if (debug)
                console.log("snakePosition", JSON.stringify([...snakePositionOriginal]), 'food', JSON.stringify(foodPositionTemp), 'wall', JSON.stringify(props.wallPosition))
                return 
            }
            const [ movingNext ] = step
            step.shift()

            if (movingNext) {
                snakePositionOriginal = [movingNext, ...snakePositionOriginal]
                // followingHeader(movingNext, snakePositionOriginal, boardSize, setSnakePositionOriginal)
                setSnakePosition([...snakePositionOriginal])
                if (checkEatBody(snakePositionOriginal)) {
                    clearInterval(interval)
                    setDefault()
                }
            }
            if (step.length === 0) {
                clearInterval(interval)
                // doEatFood(snakePositionOriginal, move, boardSize, setFoodPositionTemp, setSnakePositionOriginal)
                setDefault()
                appStateAction.setStartGame(false)
            }
        }, timerInterval)
        else
        interval = setInterval(() => {
            if (data.startGame === false) {
                clearInterval(interval)
                setDefault()
                if (debug)
                console.log("snakePosition", JSON.stringify([...snakePositionOriginal]), 'food', JSON.stringify(foodPositionTemp), 'wall', JSON.stringify(props.wallPosition))
                return 
            }
            const [ movingNext ] = allStep
            allStep.shift()

            if (movingNext) {
                setSnakePosition([...movingNext])
            }
            if (allStep.length === 0) {
                clearInterval(interval)
                // doEatFood(snakePositionOriginal, move, boardSize, setFoodPositionTemp, setSnakePositionOriginal)
                // setDefault()
                appStateAction.setStartGame(false)
            }
        }, timerInterval)

        index = 0
    }

    const checkPositionTarget = ( positionX = 0, positionY = 0, result = 'foodActive') => {
        let check = false
        if (positionX === foodPosition.x && positionY === foodPosition.y) {
            check = true
        }
        if (check !== false) {
            return result
        } else {
            return ""
        }
    }

    const setWallActive = (e, value, positionX, positionY) => {
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

        if (value === 'check') {
            setMouseDownActive(true)
            addOrRemoveWall(positionX, positionY, true)
        }
        else 
            setMouseDownActive(value)
    }

    const addOrRemoveWall = (positionX, positionY, forceActive = false) => {
        const { gameBusinessAction, gameStateAction } = props
        if ((mouseDownActive || forceActive) && !props.startGame) {
            console.log("addOrRemoveWall")
            if (!isEqualPattern(snakePosition[0], {x: positionX, y: positionY}) && !isEqualPattern(foodPosition, {x: positionX, y: positionY})) {
                switch(mouseDownType) {
                    case GameEnums.DRAG_NODE:
                        gameStateAction.setSnakePosition([{x: positionX, y: positionY}])
                        break
                    case GameEnums.SET_WALL:
                        gameBusinessAction.addOrRemoveWall(positionX, positionY)
                        break
                    case GameEnums.DRAG_TARGET:
                        gameStateAction.setFoodPosition({x: positionX, y: positionY})
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
                            onMouseOver={() => addOrRemoveWall(indexX, indexY)}
                            onMouseDown={(e) => setWallActive(e, 'check', indexX, indexY)}
                            className={`board-item ${checkPositionSnake(indexX, indexY)} ${checkPositionTarget(indexX, indexY)} ${checkWallPosition(indexX, indexY)}`}
                        >
                            {isEqualPattern(snakePosition[0], {x: indexX, y: indexY}) && <div className="container-icon"><StartNodeIcon/></div>}
                            {/* {isEqualPattern(snakePosition[snakePosition.length - 1], {x: indexX, y: indexY}) && <div className="container-icon"><StartNodeIcon/></div>} */}
                            {/* <div>
                                x: {indexX}
                            </div>
                            <div>
                                y: {indexY}
                            </div> */}
                        </div>
                    )
                })
            })}
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(BoardComponent))
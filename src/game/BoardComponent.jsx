import React, { useEffect, useState } from "react"
import { last, range } from "../helpers/dataHelpers"
import { generateGrid, dPattern, generateTargetPosition, indexOfPattern, isEqualPattern, getRotate, trailingPattern, getPositionCost } from "../helpers/pathFindingHelper"
import { ReactComponent as StartNodeIcon } from "../images/startNode.svg"
import * as appStateAction from "../stores/actions/appStateAction"
import * as gameBusinessAction from "../stores/actions/business/pathFindingBusinessAction"
import * as pathFindingStateAction from "../stores/actions/pathFindingStateAction"
import { batch, connect } from "react-redux"
import { bindActionCreators } from "redux"
import "./BoardComponent.scss"
import DataEnums from "../enums/pathFindingEnums"
import { runningProcessStep } from "../helpers/intervalHelpers"
import TargetItem from "./TargetItem"
import { getAreaBfs, getBfsStep } from "../pathFinder/bfsHelper"
import { getDfsStep } from "../pathFinder/dfsHelper"
import { getAreaAStart, getAStartStep, getTotalCost } from "../pathFinder/aStartHelper"

const mapStateToProps = (state) => {
    return {
        algorithm: state.pathFindingState.algorithm,
        areaSearch: state.pathFindingState.areaSearch,
        boardSize: state.pathFindingState.boardSize,
        targetPosition: state.pathFindingState.targetPosition,
        nodePosition: state.pathFindingState.nodePosition,
        optimizePath: state.pathFindingState.optimizePath,
        startGame: state.appState.startGame,
        timerInterval: state.pathFindingState.timerInterval,
        wallPosition: state.pathFindingState.wallPosition,
        visualizeFinding: state.pathFindingState.visualizeFinding,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        appStateAction: bindActionCreators(appStateAction, dispatch),
        gameBusinessAction: bindActionCreators(gameBusinessAction, dispatch),
        pathFindingStateAction: bindActionCreators(pathFindingStateAction, dispatch),
    }
}

const BoardComponent = (props) => {
    const isSelectedAlgorithm = props.algorithm.find((item) => item.isSelected)

    const [boardSize, setBoardSize] = useState(props.boardSize)
    const timerInterval = props.timerInterval
    const [levelEat, setLevelEat] = useState(0)
    const styleBoardContainer = Object.assign(generateGrid(boardSize), {width: window.screen.height + "px"})
    const [mouseDownActive, setMouseDownActive] = useState(false)
    const [mouseDownType, setMouseDownType] = useState(DataEnums.SET_WALL)

    const [areaSearch, setAreaSearch] = useState(props.areaSearch)
    const [nodePosition, setNodePosition] = useState(props.nodePosition)

    const [targetPosition, setTargetPosition] = useState(props.targetPosition)
    const [wallPosition, setWallPosition] = useState(props.wallPosition)
    const areaSearchForRender = [...areaSearch]
    const nodePositionForRender = [...nodePosition]
    const wallPositionForRender = [...wallPosition]
    const debug = false

    useEffect(() => {
        const { appStateAction } = props
        let obj = {
            startGame: true,
            historyAreaSearch: [],
            areaSearched: [],
            areaSearch: props.areaSearch,
            targetPosition: props.targetPosition,
            nodePosition: props.nodePosition,
            visualizeFinding: props.visualizeFinding,
        }
        if (props.startGame) {
            // const optimation = optimationStep(nodePosition, wallPosition)
            // setNodePosition(optimation)
            // --------------------------------
            const [ headNode ] = nodePosition
            switch(isSelectedAlgorithm && isSelectedAlgorithm.id) {
                case 1:
                    obj = Object.assign(obj, getAreaBfs(headNode, targetPosition, wallPosition, boardSize))
                    bfsStep(obj, headNode)
                    break;
                case 2:
                    obj = Object.assign(obj, getAreaBfs(headNode, targetPosition, wallPosition, boardSize))
                    dfsStep(obj, headNode)
                    break;
                case 3:
                    obj = Object.assign(obj, getAreaAStart(headNode, targetPosition, wallPosition, boardSize))
                    aStarStep(obj, headNode)
                    break;
                default:
                    setAreaSearch([])
                    appStateAction.setStartGame(false)
                    break;
            }
            
        }
        
        return () => {
            obj.startGame = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.startGame, props.visualizeFinding, levelEat])

    useEffect(() => {
        if (!props.startGame) {
            setBoardSize(props.boardSize)
            setNodePosition([dPattern])
            setTargetPosition(generateTargetPosition([...nodePosition, ...wallPosition], props.boardSize))
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
            setTargetPosition(props.targetPosition)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.targetPosition])

    useEffect(() => {
        if (!props.startGame) {
            setWallPosition(props.wallPosition)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.wallPosition])

    useEffect(() => {
        if (!props.startGame) {
            setNodePosition(props.nodePosition)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.nodePosition])


    const checkPositionNode = ( positionX = 0, positionY = 0, result = 'active') => {
        if (nodePositionForRender.length === 0) return false
        let index = indexOfPattern({x: positionX, y: positionY}, nodePositionForRender)
        if (index !== -1) {
            // if (nodePosition[0].x === nodePositionForRender[index].x && nodePosition[0].y === nodePositionForRender[index].y)
            //     result =  result + 'Head'
            nodePositionForRender.splice(index, 1)
            return result
        } 

        return ""
    }

    const checkWallPosition = (positionX = 0, positionY = 0, result = 'wall') => {
        if (wallPositionForRender.length === 0) return false
        const pattern = {x: positionX, y: positionY}
        let index = indexOfPattern(pattern, wallPositionForRender)
        if (index !== -1) {
            wallPositionForRender.splice(index, 1)
            return result
        }

        return ""
    }

    const checkAreaSearch = (positionX = 0, positionY = 0, result = 'areaSearch') => {
        if (areaSearchForRender.length === 0) return false
        const pattern = {x: positionX, y: positionY}
        let index = indexOfPattern(pattern, areaSearchForRender)
        if (index !== -1) {
            areaSearchForRender.splice(index, 1)
            return result
        }

        return ""
    }

    const aStarStep = (data, start) => {
        const { appStateAction, pathFindingStateAction } = props
        let historyAreaSearch = [...data.historyAreaSearch]
        data.areaSearch = last(historyAreaSearch)
        let interval = setInterval(() => {
            if(historyAreaSearch.length <= 0) {
                clearInterval(interval)
                const lastHistory = last(data.historyAreaSearch)
                const isTargetInsideAreaSearch = indexOfPattern(props.targetPosition, lastHistory) >= 0
                if (isTargetInsideAreaSearch) {
                    const allStep = getAStartStep(lastHistory, start)
                    let step = [start]
                    interval = setInterval((item) => {
                        const nextMove = allStep.pop()
                        step = [nextMove, ...step]
                        setNodePosition(step)
                        if (allStep.length === 0) {
                            clearInterval(interval)
                            appStateAction.setStartGame(false)
                            pathFindingStateAction.setNodePosition(step)
                        }
                    }, timerInterval)
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

    const bfsStep = (data, start) => {
        const { appStateAction, pathFindingStateAction } = props
        let historyAreaSearch = [...data.historyAreaSearch]
        data.areaSearch = last(historyAreaSearch)
        let interval = setInterval(() => {
            if(historyAreaSearch.length <= 0) {
                clearInterval(interval)
                const isTargetInsideAreaSearch = indexOfPattern(props.targetPosition, last(data.historyAreaSearch)) >= 0
                if (isTargetInsideAreaSearch) {
                    const allStep = getBfsStep(data.historyAreaSearch, targetPosition)
                    let step = [start]
                    interval = setInterval((item) => {
                        const nextMove = allStep.pop()
                        step = [nextMove, ...step]
                        setNodePosition(step)
                        if (allStep.length === 0) {
                            clearInterval(interval)
                            appStateAction.setStartGame(false)
                            pathFindingStateAction.setNodePosition(step)
                        }
                    }, timerInterval)
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

    const dfsStep = (dataParams, start = dPattern) => {
        let nodePositionOriginal = dataParams.nodePosition.map((item) => Object.assign({}, item))
    
        // ----------------------------------------------------

        const { historyAllStep: allStep, step} = getDfsStep(dataParams.nodePosition[0], targetPosition, wallPosition, boardSize)

        const { appStateAction } = props
        const log = () => {}

        const onDone = () => {
            appStateAction.setStartGame(false)
            runningProcessStep(dataParams, [nodePosition[0]], log, () => {}, () => {}, step, (movingNext, data1) => { return [movingNext, ...data1] }, setNodePosition, timerInterval)
        }

        runningProcessStep(dataParams, nodePositionOriginal, log, onDone, () => {}, allStep, (movingNext) => { return movingNext }, setAreaSearch, timerInterval)
    }

    const setWallActive = (e, value, positionX, positionY) => {
        const { pathFindingStateAction } = props
        e.preventDefault()
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        const patternCurrent = {x: positionX, y: positionY}

        if (nodePosition.length === 1 && isEqualPattern(nodePosition[0], patternCurrent)) {
            setMouseDownType(DataEnums.DRAG_NODE)
        } else if (nodePosition.length > 1 && isEqualPattern(last(nodePosition), patternCurrent)) {
            setMouseDownType(DataEnums.DRAG_TAIL)
        } else if (nodePosition.length > 1 && isEqualPattern(targetPosition, patternCurrent)) {
            setMouseDownType(DataEnums.DRAG_TARGET_AND_RENEW)
        } else if (isEqualPattern(targetPosition, patternCurrent)) {
            setMouseDownType(DataEnums.DRAG_TARGET)
        } else {
            setMouseDownType(DataEnums.SET_WALL)
        }
        if (!value) {
            batch(() => {
                pathFindingStateAction.setTargetPosition(targetPosition)
                pathFindingStateAction.setNodePosition(nodePosition)
                pathFindingStateAction.setWallPosition(wallPosition)
            })
        }

        if (value === 'check' && indexOfPattern(patternCurrent, nodePosition) === -1) {
            setMouseDownActive(true)
            addOrRemoveWall(positionX, positionY, true)
        }
        else 
            setMouseDownActive(value)
    }

    const addOrRemoveWall = (positionX, positionY, forceActive = false) => {
        const { gameBusinessAction } = props
        const patternCurrent = {x: positionX, y: positionY}
        if ((mouseDownActive || forceActive) && !props.startGame) {
                if (!isEqualPattern(nodePosition[0], patternCurrent) && !isEqualPattern(targetPosition, patternCurrent)) {
                switch(mouseDownType) {
                    case DataEnums.DRAG_NODE:
                        setNodePosition([patternCurrent])
                        break
                    case DataEnums.DRAG_TARGET_AND_RENEW:
                        switch(isSelectedAlgorithm && isSelectedAlgorithm.id) {
                            case 1:
                                const historyAreaSearch = getAreaBfs(last(nodePosition), patternCurrent, wallPosition, boardSize)
                                const historyBfsStep = getBfsStep(historyAreaSearch.historyAreaSearch, patternCurrent)
                                setAreaSearch(last(historyAreaSearch.historyAreaSearch))
                                setNodePosition([...historyBfsStep, last(nodePosition)])
                                setTargetPosition(patternCurrent)
                                break;
                            case 2:
                                const { step } = getDfsStep(last(nodePosition), patternCurrent, wallPosition, boardSize)
                                step.reverse()
                                setAreaSearch(step)
                                setNodePosition([...step, last(nodePosition)])
                                setTargetPosition(patternCurrent)
                                break;
                            default:
                                break
                        }
                        break
                    case DataEnums.DRAG_TAIL:
                        switch(isSelectedAlgorithm && isSelectedAlgorithm.id) {
                            case 1:
                                const historyAreaSearchAll = getAreaBfs(patternCurrent, targetPosition, wallPosition, boardSize)
                                const { historyAreaSearch } = historyAreaSearchAll
                                const historyBfsStep = getBfsStep(historyAreaSearch, targetPosition)
                                setAreaSearch(last(historyAreaSearch))
                                setNodePosition([...historyBfsStep, patternCurrent])
                                break;
                            case 2:
                                const { step } = getDfsStep(patternCurrent, targetPosition, wallPosition, boardSize)
                                step.reverse()
                                setAreaSearch(step)
                                setNodePosition([...step, patternCurrent])
                                break;
                            default:
                                break
                        }
                        break
                    case DataEnums.SET_WALL:
                        setWallPosition(gameBusinessAction.addOrRemoveData(patternCurrent, wallPosition))
                        break
                    case DataEnums.DRAG_TARGET:
                        setTargetPosition(patternCurrent)
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
                    const patternCurrent = {x: indexX, y: indexY}
                    return (
                        <div
                            key={`board-item-${indexX}-${indexY}`} 
                            onMouseEnter={() => addOrRemoveWall(indexX, indexY)}
                            onMouseDown={(e) => setWallActive(e, 'check', indexX, indexY)}
                            className={`board-item ${checkAreaSearch(indexX, indexY)} ${checkPositionNode(indexX, indexY)}`}
                        >   
                            <div className={`board-item unborder ${checkWallPosition(indexX, indexY)}`}>
                                {/* {!isEqualPattern(nodePosition[0], {x: indexX, y: indexY}) && !isEqualPattern(last(nodePosition), {x: indexX, y: indexY}) && <React.Fragment>
                                <div>x: {indexX}</div>
                                <div>y: {indexY}</div>
                                </React.Fragment>} */}
                                {/* <div style={{position: "absolute"}}>
                                    {getTotalCost(patternCurrent, areaSearch)}
                                </div> */}
                                {isEqualPattern(nodePosition[0], patternCurrent) && <div className="container-icon"><StartNodeIcon style={{transform: `rotate(${getRotate(nodePosition[1] || nodePosition[0], nodePosition[0])}deg)`}}/></div>}
                                {nodePosition.length > 1 && isEqualPattern(last(nodePosition), patternCurrent) && <div className="container-icon"><StartNodeIcon style={{transform: `rotate(${getRotate(last(nodePosition), nodePosition[0])}deg)`}}/></div>}
                                {isEqualPattern(targetPosition, patternCurrent) && indexOfPattern(targetPosition, nodePosition) === -1 && <TargetItem/>}
                            </div>
                        </div>
                    )
                })
            })}
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(BoardComponent))
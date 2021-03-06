import { arrayToString, last, range } from "./dataHelpers"
import DataEnums from "../enums/pathFindingEnums"

export const dPattern = {x: 0, y: 0}
export const dFunc = () => {}

export const generateGrid = (boardSize = 0) => {
    return {
        gridTemplateColumns: arrayToString(range(boardSize).map((item) => "auto "))
    }
}

export const doEatTarget = (nodePosition = dPattern, move = dPattern, boardSize = 0, setTargetPosition = dFunc, setNodePosition = dFunc) => {
    const { x: moveX, y: moveY } = move
    setTargetPosition(generateTargetPosition(nodePosition, boardSize))
    nodePosition.push({
        x: nodePosition[nodePosition.length - 1].x - moveX,
        y: nodePosition[nodePosition.length - 1].y - moveY,
    })
    setNodePosition(nodePosition)
}

export const gapPattern = (position1 = dPattern, position2 = dPattern) => {
    return {
        x: position2.x - position1.x,
        y: position2.y - position1.y,
    }
}

export const totalPattern = (position1 = dPattern) => {
    return position1.x + position1.y
}

export const getPositionCost = (position1, position2) => {
    const getGap = gapPattern(position1, position2)
    getGap.x = Math.abs(getGap.x)
    getGap.y = Math.abs(getGap.y)
    if (getGap.x > getGap.y) {
        getGap.x *= 10
        getGap.y *= 4
    } else {
        getGap.y *= 10
        getGap.x *= 4
    }
    return totalPattern(getGap)
}

export const plusPattern = (position1 = dPattern, position2 = dPattern) => {
    return {
        x: position2.x + position1.x,
        y: position2.y + position1.y,
    }
}

export const patternToString = (pattern = dPattern) => {
    return `x${pattern.x}y${pattern.y}`
}

export const incrementPattern = (pattern, type = DataEnums.X, increment = 1) => {
    let newPattern = {...pattern}
    switch(type) {
        case DataEnums.X:
            newPattern.x += increment
            break;
        case DataEnums.Y:
            newPattern.y += increment
            break;
        default:
            break
    }
    return newPattern
}

export const checkEatTarget = (nodePosition = dPattern, targetPosition = dPattern) => {
    const [ headNodePosition ] = nodePosition

    if (isEqualPattern(targetPosition, headNodePosition)) 
        return true

    return false
}

export const checkEatBody = (nodePosition = dPattern) => {
    const [ head ] = nodePosition
    let indexFind = nodePosition.findIndex((item, index) => index !== 0 && isEqualPattern(item, head))
    if (indexFind > 0) return true
    return false
}

export const isEqualPattern = (pattern1 = dPattern, pattern2 = dPattern) => {
    return pattern1.x === pattern2.x && pattern1.y === pattern2.y
}

export const indexOfPattern = (patternSearch = dPattern, allPattern = []) => {
    return allPattern.findIndex((item) => isEqualPattern(item, patternSearch))
}

export const isEqualPatternList = (allPattern = [], allPattern1 = []) => {
    if (allPattern.length !== allPattern1.length) return false
    let checkEqual = true
    for(let i = 0; i < allPattern.length; i ++) {
        if (!isEqualPattern(allPattern[i], allPattern1[i])) {
            checkEqual = false
            break
        }
    }
    return checkEqual
}

export const followingHeader = (headerPosition = dPattern, nodePosition = [], boardSize, setNodePosition = dFunc) => {
    let nodePositionTemp = [...nodePosition]
    for(let i = nodePositionTemp.length; i > 1; i--) {
        nodePositionTemp[i - 1] = {
            x: nodePositionTemp[i - 2].x,
            y: nodePositionTemp[i - 2].y,
        }
    }
    nodePositionTemp[0].x = headerPosition.x
    nodePositionTemp[0].y = headerPosition.y
    if (nodePositionTemp[0].x >= boardSize) {
        nodePositionTemp[0].x = 0
    } else if (nodePositionTemp[0].x < 0) {
        nodePositionTemp[0].x = boardSize - 1
    } else if (nodePositionTemp[0].y >= boardSize) {
        nodePositionTemp[0].y = 0
    } else if (nodePositionTemp[0].y < 0) {
        nodePositionTemp[0].y = boardSize - 1
    }

    setNodePosition([...nodePositionTemp])
}

export const followingTail = (move = dPattern, nodePosition = [], boardSize, setNodePosition = dFunc) => {
    let nodePositionTemp = [...nodePosition]
    for(let i = 0; i < nodePositionTemp.length - 1; i++) {
        nodePositionTemp[i] = {
            x: nodePositionTemp[i + 1].x,
            y: nodePositionTemp[i + 1].y,
        }
    }
    let last = nodePositionTemp.length - 1
    nodePositionTemp[last].x += move.x
    nodePositionTemp[last].y += move.y
    if (nodePositionTemp[last].x >= boardSize) {
        nodePositionTemp[last].x = 0
    } else if (nodePositionTemp[last].x < 0) {
        nodePositionTemp[last].x = boardSize - 1
    } else if (nodePositionTemp[last].y >= boardSize) {
        nodePositionTemp[last].y = 0
    } else if (nodePositionTemp[last].y < 0) {
        nodePositionTemp[last].y = boardSize - 1
    }

    setNodePosition([...nodePositionTemp])
}

export const movingNode = (
    nodePosition = dPattern, 
    moveX = 0, 
    moveY = 0, 
    targetPositionX = 0, 
    targetPositionY = 0, 
    boardSize = 0, 
    setNodePosition = dFunc, 
    setTargetPosition = dFunc
    ) => {
        
    let nodePositionTemp = nodePosition
    const setNodePositionTemp = (data) => nodePositionTemp = data
 
    let newMove = {
        x: nodePositionTemp[0].x + moveX,
        y: nodePositionTemp[0].y + moveY,
    }

    followingHeader(newMove, nodePositionTemp, boardSize, setNodePositionTemp)
 
    if (checkEatTarget(nodePositionTemp, {x: targetPositionX, y: targetPositionY})) 
        doEatTarget(nodePositionTemp, {x: moveX, y: moveY}, boardSize, setTargetPosition, setNodePosition)
    
    
    let eatBody = nodePositionTemp.find((item, index) => index !== 0 && item.x === nodePositionTemp[0].x && item.y === nodePositionTemp[0].y)
    if (eatBody) {
        nodePositionTemp = [{
            x: 0,
            y: 0
        }]
        setNodePosition([...nodePositionTemp])
    } else {
        setNodePosition([...nodePositionTemp])
    }
}

export const controlMove = (e, moveX, moveY, setMoveX, setMoveY) => {
    switch(e.keyCode) {
        case 38:
        case 87:
            if (moveY !== 1) {
                setMoveX(0)
                setMoveY(-1)
            }
            break;
        case 37:
        case 65:
            if (moveX !== 1) {
                setMoveX(-1)
                setMoveY(0)
            }
            break
        case 40:
        case 83:
            if (moveY !== -1) {
                setMoveX(0)
                setMoveY(1)
            }
            break;
        case 39:
        case 68:
            if (moveX !== -1) {
                setMoveX(1)
                setMoveY(0)
            }
            break;
        default:
            break;
    }
}

export const checkPositionNode = ( positionX = 0, positionY = 0, result = 'active', targetPosition = [], setPositionTarget = () => {}) => {
    const targetPositionTemp = [...targetPosition]
    if (targetPositionTemp.length === 0) return false
    let check = false
    const pattern = {x: positionX, y: positionY}
    for (let i = 0; i < targetPositionTemp.length; i ++) {
        if (check !== false) break
        if (isEqualPattern(pattern, targetPositionTemp[i])) {
            check = i
        }
    }
    if (check !== false) {
        targetPositionTemp.splice(check, 1)
        setPositionTarget(targetPositionTemp)
        return result
    } else {
        return ""
    }
}

export const generateTargetPosition = (nodePosition, boardSize) => {
    const targetPosition = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
    }

    const findPositionSame = nodePosition.findIndex((item) => item.x === targetPosition.x && item.y === targetPosition.y)

    if (findPositionSame >= 0) {
        return generateTargetPosition(nodePosition, boardSize)
    } else {
        return targetPosition
    }
}

export const getMoveExcept = (visitedPosition = [], headNode = dPattern, boardSize) => {
    let { x: headNodeX, y: headNodeY } = headNode
    let headNodeTemp = {x: headNodeX, y: headNodeY}
    let except = false
    let index 
    if (checkOutsideBoardSize(headNode, boardSize))
        return null
    for(let i = 0; i < 4; i++) {
        if (i === 0)
            headNodeTemp = {x: headNodeX + 1, y: headNodeY}
        else if (i === 1)
            headNodeTemp = {x: headNodeX - 1, y: headNodeY}
        else if (i === 2)
            headNodeTemp = {x: headNodeX, y: headNodeY + 1}
        else if (i === 3)
            headNodeTemp = {x: headNodeX, y: headNodeY - 1}
        if (!checkOutsideBoardSize(headNodeTemp, boardSize)) 
        // eslint-disable-next-line no-loop-func
            index = visitedPosition.findIndex((item) => isEqualPattern(item, headNodeTemp))
        else 
            index = 0
        if (index === -1) {
            except = true
            break
        }
    }
    if (except) return headNodeTemp
    return null 
}

export const getMoveExceptExtend = (visitedPosition = [], headNode = dPattern, boardSize) => {
    let { x: headNodeX, y: headNodeY } = headNode
    let headNodeTemp = {x: headNodeX, y: headNodeY}
    let except = false
    let index 
    if (checkOutsideBoardSize(headNode, boardSize))
        return null
    for(let i = 0; i < 8; i++) {
        if (i === 0)
            headNodeTemp = {x: headNodeX + 1, y: headNodeY}
        else if (i === 1)
            headNodeTemp = {x: headNodeX - 1, y: headNodeY}
        else if (i === 2)
            headNodeTemp = {x: headNodeX, y: headNodeY + 1}
        else if (i === 3)
            headNodeTemp = {x: headNodeX, y: headNodeY - 1}
        else if (i === 4)
            headNodeTemp = {x: headNodeX - 1, y: headNodeY - 1}
        else if (i === 5)
            headNodeTemp = {x: headNodeX - 1, y: headNodeY + 1}
        else if (i === 6)
            headNodeTemp = {x: headNodeX + 1, y: headNodeY + 1}
        else if (i === 7)
            headNodeTemp = {x: headNodeX + 1, y: headNodeY - 1}
        if (!checkOutsideBoardSize(headNodeTemp, boardSize)) 
        // eslint-disable-next-line no-loop-func
            index = visitedPosition.findIndex((item) => isEqualPattern(item, headNodeTemp))
        else 
            index = 0
        if (index === -1) {
            except = true
            break
        }
    }
    if (except) return headNodeTemp
    return null 
}

export const checkOutsideBoardSize = (position = dPattern, boardSize) => {
    boardSize -= 1
    return (position.x > boardSize) || (position.y > boardSize) || (position.x < 0) || (position.y < 0)
}

export const moveNext = (headPosition, targetPosition, obstaclePosition, boardSize) => {
    if (headPosition.x === targetPosition.x && headPosition.y === targetPosition.y) return headPosition
    const moveXP1 = Object.assign({}, headPosition, { x: headPosition.x + 1 })
    const moveXM1 = Object.assign({}, headPosition, { x: headPosition.x - 1 })
    const moveYP1 = Object.assign({}, headPosition, { y: headPosition.y + 1 })
    const moveYM1 = Object.assign({}, headPosition, { y: headPosition.y - 1 })
    let nextMove
    let nextMoveReverse

    const moveXNextDefault = () => {
        if (headPosition.x > targetPosition.x) return moveXM1 
        else return moveXP1
    }

    const moveXNextDefaultReverse = () => {
        if (headPosition.x < targetPosition.x) return moveXM1 
        else return moveXP1
    }

    const moveYNextDefault = () => {
        if (headPosition.y > targetPosition.y) return moveYM1
        else return moveYP1
    }
    
    const moveYNextDefaultReverse = () => {
        if (headPosition.y < targetPosition.y) return moveYM1
        else return moveYP1
    }

    const moveXNext = () => {
        if (headPosition.x > targetPosition.x) {
            if (indexOfPattern(incrementPattern(headPosition, DataEnums.X, -1), obstaclePosition) >= 0) return moveXP1
            return moveXM1
        } 
        else if (headPosition.x < targetPosition.x) {
            if (indexOfPattern(incrementPattern(headPosition, DataEnums.X, 1), obstaclePosition) >= 0) return moveXM1
            return moveXP1
        }
        else if (indexOfPattern(incrementPattern(headPosition, DataEnums.X, -1), obstaclePosition) >= 0) return moveXP1
        else return moveXM1
    }

    const moveYNext = () => {
        if (headPosition.y > targetPosition.y) {
            if (indexOfPattern(incrementPattern(headPosition, DataEnums.Y, -1), obstaclePosition) >= 0) return moveYP1
            return moveYM1
        }
        else if (headPosition.y < targetPosition.y) {
            if (indexOfPattern(incrementPattern(headPosition, DataEnums.Y, 1), obstaclePosition) >= 0) return moveYM1
            return moveYP1
        }
        else if (indexOfPattern(incrementPattern(headPosition, DataEnums.Y, 1), obstaclePosition) >= 0) return moveYM1
        else return moveYP1
    }
    
    if (headPosition.y === targetPosition.y) {
        nextMove = moveXNextDefault()
        if (checkOutsideBoardSize(Object.assign({}, nextMove), boardSize)) return moveYNext()
        if (obstaclePosition.length > 1 && indexOfPattern(nextMove, obstaclePosition) >= 0) return moveYNext()
        nextMove = moveXNext()
        return nextMove
    }
    else if (headPosition.x === targetPosition.x) {
        
        nextMove = moveYNextDefault()
        if (checkOutsideBoardSize(Object.assign({}, nextMove), boardSize)) return moveXNext()
        else if (obstaclePosition.length > 1 && indexOfPattern(nextMove, obstaclePosition) >= 0) return moveXNext()
        nextMove = moveYNext()
        return nextMove
    }
    else {
        let gapX = Math.abs(headPosition.x - targetPosition.x)
        let gapY = Math.abs(headPosition.y - targetPosition.y)
        let nextMoveInObstacle = false
        if (gapX <= gapY) {
            nextMove = moveXNextDefault()
            nextMoveInObstacle = obstaclePosition.length > 1 && indexOfPattern(nextMove, obstaclePosition) >= 0
            if (nextMoveInObstacle) {
                nextMoveReverse = moveXNextDefaultReverse()
                nextMove = moveYNextDefault()
                if (indexOfPattern(nextMove, obstaclePosition) >= 0)
                        if (indexOfPattern(nextMoveReverse, obstaclePosition) === -1 && !checkOutsideBoardSize(nextMoveReverse, boardSize)) 
                            return nextMoveReverse
                nextMove = moveYNext()
                return nextMove
            }
            return nextMove
        }
        else if (gapX >= gapY) {
            nextMove = moveYNextDefault()
            nextMoveInObstacle = obstaclePosition.length > 1 && indexOfPattern(nextMove, obstaclePosition) >= 0
            if (nextMoveInObstacle) {
                nextMoveReverse = moveYNextDefaultReverse()
                nextMove = moveXNextDefault()
                if (indexOfPattern(nextMove, obstaclePosition) >= 0)
                        if (indexOfPattern(nextMoveReverse, obstaclePosition) === -1 && !checkOutsideBoardSize(nextMoveReverse, boardSize)) 
                            return nextMoveReverse
                nextMove = moveXNext()
                return nextMove
            }
            return nextMove
        }
    }
}


export const dfsStepNode = (visited, currentPosition, targetPosition, wallPosition, nodePosition, boardSize, prevStep = dFunc, setVisited = dFunc) => {
    let obstacle
    let nextStep
    let visitedTemp = visited
    let [ headNode ] = nodePosition
    if (!visitedTemp[currentPosition]) {
        visitedTemp[currentPosition] = []
        setVisited(visitedTemp)
        obstacle = [...wallPosition, ...nodePosition.map((item) => Object.assign({}, item))]
        nextStep = moveNext(headNode, targetPosition, obstacle, boardSize)
    } else {
        if (visitedTemp[currentPosition].length >= 4) {
            prevStep()
            return DataEnums.CONTINUE
        }
        nextStep = getMoveExcept(visitedTemp[currentPosition], Object.assign({}, headNode), boardSize)
        obstacle = [...wallPosition, ...visitedTemp[currentPosition], ...nodePosition.map((item) => Object.assign({}, item))]
        if (nextStep && indexOfPattern(Object.assign({}, nextStep), obstacle) >= 0) {
            visitedTemp[currentPosition].push(Object.assign({}, nextStep))
            setVisited(visitedTemp)
            return DataEnums.CONTINUE
        }
        if (!nextStep) {
            prevStep()
            return DataEnums.CONTINUE
        }
    }
    return nextStep
}

export const trailingPattern = (patternList = [], startPosition) => {
    let patternListTemp = [...patternList]
    let target = last(patternListTemp)
    let patternResult = [target]
    let targetList = []
    let targetBlackList = []
    patternListTemp.pop()
    while (target) {
      
        targetList = []
        // eslint-disable-next-line no-loop-func
        patternListTemp.forEach((item, i) => {
            if (isNearTarget(target, item)) 
                targetList.push(Object.assign({}, item, { 
                    index: i 
                }))
        })
      
        if (targetList.length > 0) {
            
            if (targetList.length === 1) {
                [ target ] = targetList
            } else {
                target = arrayFilterNotIncludeArrayPattern(targetList, targetBlackList).reduce((prev, current) => ((prev.totalCost <= current.totalCost && prev.hCost <= current.hCost) ? prev : current)) 
            }

            patternListTemp.splice(target.index, 1)
            // eslint-disable-next-line no-loop-func
            if (patternResult.indexOf((item) => isEqualPattern(item, target)) === -1) {
                patternResult.push(target)
            } 
           
            if (isNearTarget(startPosition, target)) break
        }
        else {
            targetBlackList.push(target)
            patternResult.pop()
            target = last(patternResult)
            continue
            // target = null
        }
    }
    patternResult.push(startPosition)
    return patternResult
}

export const cleanPattern = (patternList = []) => {
    let patternListTemp = [...patternList]
    patternList.forEach((item, index) => {
        if (patternList[index + 1]) {
            let isItemFar = isFarFromTarget(patternList[index + 1], patternList[index])
            if (isItemFar) {
                let indexDuplicate = patternListTemp.findIndex((itemSearch) => isEqualPattern(itemSearch, item))
                if (indexDuplicate !== - 1)  patternListTemp.splice(indexDuplicate, 1)
            }
        }
    }) 
    return patternListTemp
}

export const fillGapPatternDiagonal = (patternList = []) => {
    let patternListTemp = [...patternList]
    let index = 0
    while(patternListTemp[index]) {
        const isPatternDiagonal = patternListTemp[index] && patternListTemp[index + 1] && !isNearTarget(patternListTemp[index], patternListTemp[index + 1])
        if (isPatternDiagonal) {
            let gapMove = gapPattern(patternListTemp[index], patternListTemp[index + 1])
            gapMove.y = 0
            const newPattern = Object.assign({}, patternListTemp[index], {
                x: patternListTemp[index].x + gapMove.x
            })
            patternListTemp.splice(index, 0, newPattern)
            index += 2 
        }
        index ++
    }
    return patternListTemp
}

export const removeDuplicatePattern = (patternList = []) => {
    let patternListTemp = [...patternList]
    patternList.forEach((item, index) => {
        let countDuplicate = 0
        let lastIndexDuplicate = -1
        let indexDuplicate = patternListTemp.findIndex((itemSearch, indexSearch) => {
            if (isEqualPattern(item, itemSearch)) {
                countDuplicate += 1
                if (countDuplicate > 1) {
                    if (index === 0) {
                        lastIndexDuplicate = indexSearch
                    }
                    return true
                }
            }
            return false
        })
        if (lastIndexDuplicate !== -1) {
            patternListTemp.splice(lastIndexDuplicate, 1)
        }
        else if (indexDuplicate !== - 1) patternListTemp.splice(indexDuplicate, 1)
    })
    return cleanPattern(patternListTemp)
}

export const cutStep = (step = [], pointStart = dPattern, pointEnd = dPattern, obstacle = []) => {
    const move = gapPattern(pointStart, pointEnd)
    let gapStep = 0
    if (move.x !== 0) {
        gapStep = Math.abs(move.x)
        move.x = move.x > 0 ? 1 : -1
    }
    else {
        gapStep = Math.abs(move.y)
        move.y = move.y > 0 ? 1 : -1
    }
    let stepTemp = [...step]
    let indexStart = stepTemp.findIndex((item) => isEqualPattern(item, pointStart))
    let indexEnd = stepTemp.findIndex((item) => isEqualPattern(item, pointEnd))
    if (indexStart === -1 || indexEnd === -1) return step

    stepTemp.splice(indexStart + 1, indexEnd - indexStart )
    let checkHitObstacle = false
    for(let i = indexStart + 1; i <= indexStart + gapStep; i ++) {
        let nextMoving = null 
        if (move.x !== 0) {
            nextMoving = Object.assign({}, pointStart, {x: pointStart.x + move.x})
            move.x += move.x > 0 ? 1 : -1
        } else {
            nextMoving = Object.assign({}, pointStart, {y: pointStart.y + move.y})
            move.y += move.y > 0 ? 1 : -1
        }
        if (indexOfPattern(nextMoving, obstacle) !== -1) {
            checkHitObstacle = true
            break
        }
        stepTemp.splice(i, 0, nextMoving)
    }
    
    return checkHitObstacle ? step : (stepTemp)
}

const getSortCut = (step = [], obstacle = []) => {
    let historyX = []
    let historyY = []
    let allHistory = []
    let index
    let key
    for(let i = 0; i < step.length; i ++) {
        const stepCurrent = step[i]
        if (step[i + 1] && stepCurrent.x === step[i + 1].x) continue
        index = i
        key = stepCurrent.x + 'a' + stepCurrent.y
        if (!historyX[key]) {
            
            historyX[key] = {
                start: index,
                end: index,
                startPoint: Object.assign({}, step[i]),
                endPoint: Object.assign({}, step[i]),
            }
            index ++
            while(index < step.length) {
                if (step[index].x === stepCurrent.x) {
                    historyX[key].end = index
                    historyX[key].endPoint = Object.assign({}, step[index])
                    index = step.length
                }
                index ++
            }
            if (historyX[key].start === historyX[key].end) delete historyX[key]
            else allHistory.push(historyX[key])
        }
    }

    for(let i = 0; i < step.length; i ++) {
        const stepCurrent = step[i]
        if (step[i + 1] && stepCurrent.y === step[i + 1].y) continue
        index = i
        key = stepCurrent.y + 'z' + stepCurrent.x
        if (!historyY[key]) {
            historyY[key] = {
                start: index,
                end: index,
                startPoint: Object.assign({}, step[i]),
                endPoint: Object.assign({}, step[i]),
            }
            index ++
            while(index < step.length) {
                if (step[index].y === stepCurrent.y) {
                    historyY[key].end = index
                    historyY[key].endPoint = Object.assign({}, step[index])
                    index = step.length
                }
                index ++
            }
            if (historyY[key].start === historyY[key].end) delete historyY[key]
            else allHistory.push(historyY[key])
        }
    }
    return allHistory.concat(historyY)
}

export const getTargetClass = (position = dPattern) => {
    return document.body.getElementsByClassName(`board-x${position.x}y${position.y}`)[0]
}

export const optimationStep = (step = [], obstacle = [], deepLevel = 0) => {
    let sortCuts = getSortCut(step, obstacle)
    if (sortCuts.length === 0) return step
    let result = []
    sortCuts.forEach((item, index) => {
        let hasil = cutStep(step, item.startPoint, item.endPoint, obstacle)
        if (hasil.length !== step.length) {
            result.push(hasil)
        }
    })
    let lastResult = null
    if (result.length === 0) return step
    result.forEach((item) => {
        if (!lastResult) {
            lastResult = item
        } else if (lastResult && lastResult.length > item.length) {
            lastResult = item
        }
    })
    // let checkSamePath = 0
    // result.forEach((item, index) => {
    //     const resultTemp = isEqualPatternList(item, lastResult)
    //     if (resultTemp) {
    //         console.log("check", resultTemp, index, [...item], deepLevel)
    //         checkSamePath ++
    //     }
    // })
    return optimationStep([...removeDuplicatePattern(lastResult)], obstacle, deepLevel + 1)
}

export const getRotate = (pattern1 = dPattern, pattern2 = dPattern) => {
    const move = gapPattern(pattern1, pattern2)
    if (move.y >= 1) return 90
    else if (move.x <= -1) return 180
    else if (move.y <= -1) return 270
    return 0
}


export const isNearTarget = (targetPosition = dPattern, position = dPattern, extendDiagonal = false) => {
    const gapMove = gapPattern(position, targetPosition)
    const isNearY = (gapMove.y === 1 || gapMove.y === -1)
    const isNearX = (gapMove.x === 1 || gapMove.x === -1)
    const isNearNormal = (gapMove.x === 0 && isNearY) || (gapMove.y === 0 && isNearX)
    const isNearDiagonal = (gapMove.x === -1 && gapMove.y === 1) || (gapMove.x === 1 && gapMove.y === 1) || (gapMove.x === 1 && gapMove.y === -1) || (gapMove.x === -1 && gapMove.y === -1)

    if (extendDiagonal && (isNearNormal || isNearDiagonal)) 
        return true
    else if (isNearNormal) {
        return true
    }
        
    return false
}

export const getNearTargetIndex = (targetPosition = dPattern, patternList = []) => {
    let findItem = patternList.find((item) => isNearTarget(item, targetPosition))
    if (findItem >= 0)
        return findItem
    return -1
}

export const isFarFromTarget = (targetPosition, position) => {
    let gapMove = gapPattern(position, targetPosition)
    if (gapMove.x > 1 || gapMove.y > 1 || gapMove.x < -1 || gapMove.y < -1)
        return true
    return false
}

export const arrayFilterNotIncludeArrayPattern = (arrayTarget = [], arrayExclude = []) => {
    return arrayTarget.filter((item) => arrayExclude.findIndex((itemHistory) => isEqualPattern(itemHistory, item)) === -1)
}

export const getCostDetail = (startPosition, targetPosition, position, nearPosition) => {
    const newPosition = {...position}
    newPosition.sCost = (nearPosition && nearPosition.sCost) || 0
    newPosition.sCost += 5
    newPosition.hCost = getPositionCost(startPosition, newPosition)
    newPosition.gCost = getPositionCost(targetPosition, newPosition)
    newPosition.totalCost = newPosition.gCost + newPosition.hCost + newPosition.sCost
    // newPosition.totalCost = newPosition.gCost + newPosition.hCost
    return newPosition
}
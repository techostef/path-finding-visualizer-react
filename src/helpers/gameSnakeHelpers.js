import { arrayToString, range } from "./dataHelpers"
import gameEnums from "../enums/gameEnums"
import GameEnums from "../enums/gameEnums"

export const dPattern = {x: 0, y: 0}
const dFunc = () => {}

export const generateGrid = (boardSize = 0) => {
    return {
        gridTemplateColumns: arrayToString(range(boardSize).map((item) => "auto "))
    }
}

export const doEatFood = (snakePosition = dPattern, move = dPattern, boardSize = 0, setFoodPosition = dFunc, setSnakePosition = dFunc) => {
    const { x: moveX, y: moveY } = move
    setFoodPosition(generateFoodPosition(snakePosition, boardSize))
    snakePosition.push({
        x: snakePosition[snakePosition.length - 1].x - moveX,
        y: snakePosition[snakePosition.length - 1].y - moveY,
    })
    setSnakePosition(snakePosition)
}

export const gapPattern = (position1 = dPattern, position2 = dPattern) => {
    return {
        x: position2.x - position1.x,
        y: position2.y - position1.y,
    }
}

export const patternToString = (pattern = dPattern) => {
    return `x${pattern.x}y${pattern.y}`
}

export const incrementPattern = (pattern, type = gameEnums.X, increment = 1) => {
    let newPattern = {...pattern}
    switch(type) {
        case gameEnums.X:
            newPattern.x += increment
            break;
        case gameEnums.Y:
            newPattern.y += increment
            break;
        default:
            break
    }
    return newPattern
}

export const checkEatTarget = (snakePosition = dPattern, targetPosition = dPattern) => {
    const { x: targetPositionX, y: targetPositionY } = targetPosition

    if (targetPositionX === snakePosition[0].x && targetPositionY === snakePosition[0].y) 
        return true

    return false
}

export const checkEatBody = (snakePosition = dPattern) => {
    const [ head ] = snakePosition
    let indexFind = snakePosition.findIndex((item, index) => index !== 0 && isEqualPattern(item, head))
    if (indexFind > 0) return true
    return false
}

export const isEqualPattern = (pattern1 = dPattern, pattern2 = dPattern) => {
    return pattern1.x === pattern2.x && pattern1.y === pattern2.y
}

export const indexOfPattern = (patternSearch = dPattern, allPattern = []) => {
    return allPattern.findIndex((item) => isEqualPattern(item, patternSearch))
}

export const followingHeader = (headerPosition = dPattern, snakePosition = [], boardSize, setSnakePosition = dFunc) => {
    let snakePositionTemp = [...snakePosition]
    for(let i = snakePositionTemp.length; i > 1; i--) {
        snakePositionTemp[i - 1] = {
            x: snakePositionTemp[i - 2].x,
            y: snakePositionTemp[i - 2].y,
        }
    }
    snakePositionTemp[0].x = headerPosition.x
    snakePositionTemp[0].y = headerPosition.y
    if (snakePositionTemp[0].x >= boardSize) {
        snakePositionTemp[0].x = 0
    } else if (snakePositionTemp[0].x < 0) {
        snakePositionTemp[0].x = boardSize - 1
    } else if (snakePositionTemp[0].y >= boardSize) {
        snakePositionTemp[0].y = 0
    } else if (snakePositionTemp[0].y < 0) {
        snakePositionTemp[0].y = boardSize - 1
    }

    setSnakePosition([...snakePositionTemp])
}

export const followingTail = (move = dPattern, snakePosition = [], boardSize, setSnakePosition = dFunc) => {
    let snakePositionTemp = [...snakePosition]
    for(let i = 0; i < snakePositionTemp.length - 1; i++) {
        snakePositionTemp[i] = {
            x: snakePositionTemp[i + 1].x,
            y: snakePositionTemp[i + 1].y,
        }
    }
    let last = snakePositionTemp.length - 1
    snakePositionTemp[last].x += move.x
    snakePositionTemp[last].y += move.y
    if (snakePositionTemp[last].x >= boardSize) {
        snakePositionTemp[last].x = 0
    } else if (snakePositionTemp[last].x < 0) {
        snakePositionTemp[last].x = boardSize - 1
    } else if (snakePositionTemp[last].y >= boardSize) {
        snakePositionTemp[last].y = 0
    } else if (snakePositionTemp[last].y < 0) {
        snakePositionTemp[last].y = boardSize - 1
    }

    setSnakePosition([...snakePositionTemp])
}

export const movingSnake = (
    snakePosition = dPattern, 
    moveX = 0, 
    moveY = 0, 
    foodPositionX = 0, 
    foodPositionY = 0, 
    boardSize = 0, 
    setSnakePosition = dFunc, 
    setFoodPosition = dFunc
    ) => {
        
    let snakePositionTemp = snakePosition
    const setSnakePositionTemp = (data) => snakePositionTemp = data
 
    let newMove = {
        x: snakePositionTemp[0].x + moveX,
        y: snakePositionTemp[0].y + moveY,
    }

    followingHeader(newMove, snakePositionTemp, boardSize, setSnakePositionTemp)
 
    if (checkEatTarget(snakePositionTemp, {x: foodPositionX, y: foodPositionY})) 
        doEatFood(snakePositionTemp, {x: moveX, y: moveY}, boardSize, setFoodPosition, setSnakePosition)
    
    
    let eatBody = snakePositionTemp.find((item, index) => index !== 0 && item.x === snakePositionTemp[0].x && item.y === snakePositionTemp[0].y)
    if (eatBody) {
        snakePositionTemp = [{
            x: 0,
            y: 0
        }]
        setSnakePosition([...snakePositionTemp])
    } else {
        setSnakePosition([...snakePositionTemp])
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

export const checkPositionSnake = ( positionX = 0, positionY = 0, result = 'active', snakePositionForRender = [], setSnakePositionForRender = () => {}) => {
    const snakePositionForRenderTemp = [...snakePositionForRender]
    if (snakePositionForRenderTemp.length === 0) return false
    let check = false
    for (let i = 0; i < snakePositionForRenderTemp.length; i ++) {
        if (check !== false) break
        if (positionX === snakePositionForRenderTemp[i].x && positionY === snakePositionForRenderTemp[i].y) {
            check = i
        }
    }
    if (check !== false) {
        snakePositionForRenderTemp.splice(check, 1)
        setSnakePositionForRender(snakePositionForRenderTemp)
        return result
    } else {
        return ""
    }
}

export const generateFoodPosition = (snakePosition, boardSize) => {
    const foodPosition = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
    }

    const findPositionSame = snakePosition.findIndex((item) => item.x === foodPosition.x && item.y === foodPosition.y)

    if (findPositionSame >= 0) {
        return generateFoodPosition(snakePosition, boardSize)
    } else {
        return foodPosition
    }
}

export const getMoveExcept = (visitedPosition = [], headSnake = dPattern, boardSize) => {
    let { x: headSnakeX, y: headSnakeY } = headSnake
    let headSnakeTemp = {x: headSnakeX, y: headSnakeY}
    let except = false
    let index 
    if (headSnakeX >= boardSize && headSnakeY >= boardSize)
        return null
    for(let i = 0; i < 4; i++) {
        if (i === 0)
            headSnakeTemp = {x: headSnakeX + 1, y: headSnakeY}
        else if (i === 1)
            headSnakeTemp = {x: headSnakeX - 1, y: headSnakeY}
        else if (i === 2)
            headSnakeTemp = {x: headSnakeX, y: headSnakeY + 1}
        else if (i === 3)
            headSnakeTemp = {x: headSnakeX, y: headSnakeY - 1}
        if (!checkOutsideBoardSize(headSnakeTemp, boardSize)) 
        // eslint-disable-next-line no-loop-func
            index = visitedPosition.findIndex((item) => isEqualPattern(item, headSnakeTemp))
        else 
            index = 0
        if (index === -1) {
            except = true
            break
        }
    }
    if (except) return headSnakeTemp
    return null 
}

export const checkOutsideBoardSize = (position = dPattern, boardSize) => {
    boardSize -= 1
    return (position.x > boardSize) || (position.y > boardSize) || (position.x < 0) || (position.y < 0)
}

export const moveNext = (headPosition, foodPosition, obstaclePosition, boardSize) => {
    if (headPosition.x === foodPosition.x && headPosition.y === foodPosition.y) return headPosition
    const moveXP1 = Object.assign({}, headPosition, { x: headPosition.x + 1 })
    const moveXM1 = Object.assign({}, headPosition, { x: headPosition.x - 1 })
    const moveYP1 = Object.assign({}, headPosition, { y: headPosition.y + 1 })
    const moveYM1 = Object.assign({}, headPosition, { y: headPosition.y - 1 })
    let nextMove
    let nextMoveReverse

    const moveXNextDefault = () => {
        if (headPosition.x > foodPosition.x) return moveXM1 
        else return moveXP1
    }

    const moveXNextDefaultReverse = () => {
        if (headPosition.x < foodPosition.x) return moveXM1 
        else return moveXP1
    }

    const moveYNextDefault = () => {
        if (headPosition.y > foodPosition.y) return moveYM1
        else return moveYP1
    }
    
    const moveYNextDefaultReverse = () => {
        if (headPosition.y < foodPosition.y) return moveYM1
        else return moveYP1
    }

    const moveXNext = () => {
        if (headPosition.x > foodPosition.x) {
            if (indexOfPattern(incrementPattern(headPosition, gameEnums.X, -1), obstaclePosition) >= 0) return moveXP1
            return moveXM1
        } 
        else if (headPosition.x < foodPosition.x) {
            if (indexOfPattern(incrementPattern(headPosition, gameEnums.X, 1), obstaclePosition) >= 0) return moveXM1
            return moveXP1
        }
        else if (indexOfPattern(incrementPattern(headPosition, gameEnums.X, -1), obstaclePosition) >= 0) return moveXP1
        else return moveXM1
    }

    const moveYNext = () => {
        if (headPosition.y > foodPosition.y) {
            if (indexOfPattern(incrementPattern(headPosition, gameEnums.Y, -1), obstaclePosition) >= 0) return moveYP1
            return moveYM1
        }
        else if (headPosition.y < foodPosition.y) {
            if (indexOfPattern(incrementPattern(headPosition, gameEnums.Y, 1), obstaclePosition) >= 0) return moveYM1
            return moveYP1
        }
        else if (indexOfPattern(incrementPattern(headPosition, gameEnums.Y, 1), obstaclePosition) >= 0) return moveYM1
        else return moveYP1
    }
    
    if (headPosition.y === foodPosition.y) {
        nextMove = moveXNextDefault()
        if (checkOutsideBoardSize(Object.assign({}, nextMove), boardSize)) return moveYNext()
        if (obstaclePosition.length > 1 && indexOfPattern(nextMove, obstaclePosition) >= 0) return moveYNext()
        nextMove = moveXNext()
        return nextMove
    }
    else if (headPosition.x === foodPosition.x) {
        
        nextMove = moveYNextDefault()
        if (isEqualPattern({x: 12, y: 10}, headPosition))
        console.log("nextMove", headPosition, nextMove)
        if (checkOutsideBoardSize(Object.assign({}, nextMove), boardSize)) return moveXNext()
        else if (obstaclePosition.length > 1 && indexOfPattern(nextMove, obstaclePosition) >= 0) return moveXNext()
        nextMove = moveYNext()
        return nextMove
    }
    else {
        let gapX = Math.abs(headPosition.x - foodPosition.x)
        let gapY = Math.abs(headPosition.y - foodPosition.y)
        if (gapX <= gapY) {
            nextMove = moveXNextDefault()
            if (obstaclePosition.length > 1 && indexOfPattern(nextMove, obstaclePosition) >= 0) {
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
            if (obstaclePosition.length > 1 && indexOfPattern(nextMove, obstaclePosition) >= 0) {
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


export const dfsStepNode = (visited, currentPosition, foodPositionTemp, wallPosition, nodePosition, boardSize, prevStep = dFunc, setVisited = dFunc) => {
    let obstacle
    let nextStep
    let visitedTemp = visited
    let [ headNode ] = nodePosition
    if (!visitedTemp[currentPosition]) {
        visitedTemp[currentPosition] = []
        setVisited(visitedTemp)
        obstacle = [...wallPosition, ...nodePosition.map((item) => Object.assign({}, item))]
        nextStep = moveNext(headNode, foodPositionTemp, obstacle, boardSize)
    } else {
        if (visitedTemp[currentPosition].length >= 4) {
            prevStep()
            return GameEnums.CONTINUE
        }
        nextStep = getMoveExcept(visitedTemp[currentPosition], Object.assign({}, headNode), boardSize)
        obstacle = [...wallPosition, ...visitedTemp[currentPosition], ...nodePosition.map((item) => Object.assign({}, item))]
        if (nextStep && indexOfPattern(Object.assign({}, nextStep), obstacle) >= 0) {
            visitedTemp[currentPosition].push(Object.assign({}, nextStep))
            setVisited(visitedTemp)
            return GameEnums.CONTINUE
        }
        if (!nextStep) {
            prevStep()
            return GameEnums.CONTINUE
        }
    }
    return nextStep
}
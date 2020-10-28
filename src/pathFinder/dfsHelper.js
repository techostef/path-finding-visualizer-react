import DataEnums from "../enums/pathFindingEnums"
import { checkEatTarget, checkOutsideBoardSize, dfsStepNode, dPattern, gapPattern, getCostDetail, indexOfPattern, patternToString, trailingPattern } from "../helpers/pathFindingHelper"
import { getAreaBfs } from "./bfsHelper"


export const getDFSStep = (areaSearch = [], startPosition) => {
    const step = trailingPattern(areaSearch, startPosition)
    return step 
}

export const getDfsStep = (startPosition, targetPosition = dPattern, wallPosition = [], boardSize = 0) => {
    
    let step = []
    let visited = []
    let move = dPattern
    let moveAll = []
    let targetPositionTemp = [Object.assign({}, startPosition)]
    let eatFood = false
    let nextStep
    let allStep = []
    let currentPosition 

    const { areaSearch } = getAreaBfs(startPosition, targetPosition, wallPosition, boardSize)
    const isTargetInWall = indexOfPattern(targetPosition, wallPosition) >= 0
    const startPositionInWall = indexOfPattern(startPosition, wallPosition) >= 0
    const targetNotFound = indexOfPattern(targetPosition, areaSearch) === -1
    const invalidPosition = (isTargetInWall || startPositionInWall || targetNotFound)

    if (invalidPosition) {
        return {
            historyAllStep: allStep,
            step: step
        }
    }
    // ----------------------------------------------------

    const setVisited = (data) => visited = data

    const prevStep = (r = 0) => {
        targetPositionTemp.shift()
        step.pop()
        allStep.push([...step].reverse().map((item) => Object.assign({}, item, {c: r})))
    }

    while (!eatFood) {
        let [ headNode ] = targetPositionTemp
        currentPosition = patternToString(headNode)

        nextStep = dfsStepNode(visited, currentPosition, targetPosition, [...wallPosition], targetPositionTemp.map((item) => Object.assign({}, item)), boardSize, prevStep, setVisited)
        if (nextStep === DataEnums.CONTINUE) continue

        visited[currentPosition].push(Object.assign({}, nextStep))
        const obstacle = [...wallPosition, ...targetPositionTemp]
        const nextStepInObstacle = indexOfPattern(nextStep, obstacle) >= 0
        const isOutsideBoard = checkOutsideBoardSize(Object.assign({}, nextStep), boardSize)

        if (nextStepInObstacle || isOutsideBoard) {
            continue
        }

        nextStep = getCostDetail(startPosition, targetPosition, nextStep)
        move = gapPattern(Object.assign({}, headNode), Object.assign({}, nextStep))
        moveAll.push(Object.assign({}, move))
        step.push(Object.assign({}, nextStep))
        allStep.push([...step].reverse().map((item) => Object.assign({}, item)))
        targetPositionTemp = [Object.assign({}, nextStep), ...targetPositionTemp]
        
        if (checkEatTarget(targetPositionTemp, targetPosition)) {
            // if (props.optimizePath) {
                // const optimation = optimationStep([startPosition, ...step], wallPosition)
                // step = [...optimation]
                // allStep.push([...optimation])
            // }
            eatFood = true
            continue
        }
    }

    return {
        historyAllStep: allStep,
        step: step
    }
}
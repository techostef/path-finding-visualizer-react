import { last } from "../helpers/dataHelpers"
import { dPattern, getMoveExcept, indexOfPattern, isNearTarget, patternToString } from "../helpers/pathFindingHelper"

export const getBfsStep = (historyAreaSearchData = [[]], targetPosition = dPattern) => {
    const historyAreaSearch = [...historyAreaSearchData]
    const allStep = []
    let lastMove = targetPosition
    let targetNotFound = indexOfPattern(targetPosition, last(historyAreaSearchData)) === -1

    if (targetNotFound) return allStep

    while(historyAreaSearch.length) {
        const nextMove = historyAreaSearch.pop()
       
        if (allStep.length) lastMove = nextMove.find((item) => isNearTarget(last(allStep), item))
        allStep.push(lastMove)
    }
    return allStep
}


export const getAreaBfs = (startPosition = dPattern, targetPosition = dPattern, wallPosition = [], boardSize = 0) => {
    const newData = {
        areaSearched: [],
        areaSearch: [],
        historyAreaSearch: [],
    }

    const areaSearchStepRecursive = (data, deepLevel = 0) => {
        let areaSearchOriginal = data.areaSearch.length === 0 ? [startPosition] : [...data.areaSearch]
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
                const isVisitedLengthMoreThan = visited[currentPosition] && visited[currentPosition].length >= 4

                if (isVisitedLengthMoreThan) {
                    nextSearch = null
                    continue
                }
                
                nextSearch = getMoveExcept(visited[currentPosition], areaSearchOriginal[i], boardSize)
                visited[currentPosition].push(nextSearch)
                const notFoundInAreaSearch = nextSearch && indexOfPattern(nextSearch, areaSearchTemp) === -1
                if (notFoundInAreaSearch) {
                    areaSearchTemp.push(Object.assign({}, nextSearch))
                    newAreaSearch.push(Object.assign({}, nextSearch))
                    historyAreaSearch.push([...areaSearchTemp].map((item) => Object.assign({}, item)))
                }
            }
        }

        let areaSearched = data.areaSearched ? [...data.areaSearched] : []
        let obstacle = [startPosition, ...areaSearched, ...wallPosition]
        newAreaSearch = newAreaSearch.filter((item) => indexOfPattern(item, obstacle) === -1)
        
        areaSearched = [...areaSearched, ...newAreaSearch]

        if (newAreaSearch.length > 0) {
            data.areaSearched = [...areaSearched].map((item) => Object.assign({}, item))
            data.areaSearch = [...newAreaSearch].map((item) => Object.assign({}, item))
            data.visited = [...visited].map((item) => Object.assign({}, item))
            data.historyAreaSearch.push(areaSearched)
            const notFoundTargetInAreaSearch = indexOfPattern(targetPosition, areaSearched) === -1
            if (notFoundTargetInAreaSearch) areaSearchStepRecursive(data, deepLevel + 1)
        }
    }

    areaSearchStepRecursive(newData)
    return newData
}
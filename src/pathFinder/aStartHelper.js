import { dPattern, getMoveExceptExtend, indexOfPattern, patternToString, getPositionCost, trailingPattern, fillGapPatternDiagonal, getMoveExcept } from "../helpers/pathFindingHelper"
import _ from "lodash"
import { arrayFilterNotIncludeArray, arrayNotIncludeArray } from "../helpers/dataHelpers"

export const getTotalCost = (position = dPattern, areaSearch = []) => {
    let index = indexOfPattern(position, areaSearch)
    if (index >= 0) {
        const { totalCost, hCost, gCost, x, y } = areaSearch[index]
        // return `${totalCost}-${hCost}-${gCost}`
        // return `${totalCost}x${x}y${y}`
        return `${totalCost}`
    }

    return null
}

export const getAStartStep = (areaSearch = [], startPosition) => {
    const step = trailingPattern(areaSearch, startPosition)
    return step 
}

export const getAreaAStart = (startPosition = dPattern, targetPosition = dPattern, wallPosition = [], boardSize = 0) => {
    const newData = {
        areaSearched: [],
        areaSearch: [],
        historyAreaSearch: [],
    }

    const areaSearchStepRecursive = (data, deepLevel = 0) => {
        // if (deepLevel === 2) return
        let areaSearchOriginal = data.areaSearch.length === 0 ? [startPosition] : [...data.areaSearch]
        let areaSearchTemp = [...areaSearchOriginal]
        let nextSearch
        let currentPosition
        let visited = data.visited ? data.visited : []
        let newAreaSearch = []
        let notFoundTargetInAreaSearch = false
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
                    nextSearch.hCost = getPositionCost(startPosition, nextSearch)
                    nextSearch.gCost = getPositionCost(targetPosition, nextSearch)
                    nextSearch.totalCost = nextSearch.gCost + nextSearch.hCost
                    areaSearchTemp.push(Object.assign({}, nextSearch))
                    newAreaSearch.push(Object.assign({}, nextSearch))
                }
            }
        }

        let areaSearched = data.areaSearched ? [...data.areaSearched] : []
        let obstacle = [startPosition, ...areaSearched, ...wallPosition]
        newAreaSearch = newAreaSearch.filter((item) => indexOfPattern(item, obstacle) === -1)
        
        areaSearched = [...areaSearched, ...newAreaSearch]
        
        if (newAreaSearch.length > 0) {
            let minCost = newAreaSearch.reduce((prev, current) => ((prev.totalCost < current.totalCost && prev.gCost < current.gCost) ? prev : current)) 
            let arrayMinCost = newAreaSearch.filter((item) => item.totalCost === minCost.totalCost)
            if (arrayMinCost.length > 1) minCost = arrayMinCost.reduce((prev, current) => ((prev.gCost < current.gCost) ? prev : current))
            
            if (!data.historyMinCost) data.historyMinCost = []
            if (!data.minCostGlobal) data.minCostGlobal = minCost
            const limitArray = arrayFilterNotIncludeArray(areaSearched, data.historyMinCost)
            let minCostInAreaSearch = limitArray.reduce((prev, current) => ((prev.totalCost < current.totalCost) ? prev : current)) 
            if (minCost.totalCost > minCostInAreaSearch.totalCost) {
                minCost = minCostInAreaSearch
            }
            
            data.areaSearch = [minCost]
            data.areaSearched = [...areaSearched].map((item) => Object.assign({}, item))
            
            data.historyMinCost.push(minCost)

            data.visited = [...visited].map((item) => Object.assign({}, item))
            data.historyAreaSearch.push([...data.historyMinCost])
            notFoundTargetInAreaSearch = indexOfPattern(targetPosition, areaSearched) === -1
            if (notFoundTargetInAreaSearch) areaSearchStepRecursive(data, deepLevel + 1)
        } else {
            const limitArrayOther = arrayFilterNotIncludeArray(areaSearched, data.historyMinCost)
            if (limitArrayOther.length > 0) {
                data.areaSearch = [limitArrayOther[0]]
                data.historyMinCost.push(limitArrayOther[0])
                notFoundTargetInAreaSearch = indexOfPattern(targetPosition, areaSearched) === -1
                if (notFoundTargetInAreaSearch) areaSearchStepRecursive(data, deepLevel + 1)
            }
        }
    }
    areaSearchStepRecursive(newData)
    return newData
}
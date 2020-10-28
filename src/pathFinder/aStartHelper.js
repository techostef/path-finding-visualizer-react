import { dPattern, indexOfPattern, patternToString, getPositionCost, trailingPattern, getMoveExcept, arrayFilterNotIncludeArrayPattern } from "../helpers/pathFindingHelper"

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
        let areaSearchOriginal = data.areaSearch.length === 0 ? [startPosition] : data.areaSearch
        let areaSearchTemp = [...areaSearchOriginal]
        let nextSearch
        let currentPosition
        let visited = data.visited ? data.visited : []
        let newAreaSearch = []
        let notFoundTargetInAreaSearch = false
        // let areaSearched = data.areaSearched ? data.areaSearched : []
        let obstacle = [startPosition].concat(data.areaSearched).concat(wallPosition)
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
                    if (indexOfPattern(nextSearch, obstacle) === -1)
                        newAreaSearch.push(Object.assign({}, nextSearch))
                }
            }
        }

        // let obstacle = [startPosition, ...areaSearched, ...wallPosition]
        // newAreaSearch = newAreaSearch.filter((item) => indexOfPattern(item, obstacle) === -1)
        
        data.areaSearched = data.areaSearched.concat(newAreaSearch)
        
        if (newAreaSearch.length > 0) {
            let minCost = newAreaSearch.reduce((prev, current) => ((prev.totalCost < current.totalCost) ? prev : current)) 
            let arrayMinCost = newAreaSearch.filter((item) => item.totalCost === minCost.totalCost)
            if (arrayMinCost.length > 1) minCost = arrayMinCost.reduce((prev, current) => ((prev.gCost < current.gCost) ? prev : current))
            
            if (!data.areaUnSearched) data.areaUnSearched = []
            if (!data.historyMinCost) data.historyMinCost = []
            if (!data.minCostGlobal) data.minCostGlobal = minCost

            if (data.areaUnSearched.length > 0) {
                let minCostInAreaSearch = data.areaUnSearched.reduce((prev, current) => ((prev.totalCost < current.totalCost) ? prev : current)) 
                if (minCost.totalCost > minCostInAreaSearch.totalCost) {
                    minCost = minCostInAreaSearch
                }
            }
            
            
            data.areaSearch = [minCost]
            
            data.historyMinCost.push(minCost)
            data.areaUnSearched = arrayFilterNotIncludeArrayPattern(data.areaSearched, data.historyMinCost)
            data.visited = visited.map((item) => Object.assign({}, item))
            data.historyAreaSearch.push([...data.historyMinCost])
            notFoundTargetInAreaSearch = indexOfPattern(targetPosition, data.areaSearched) === -1
            if (notFoundTargetInAreaSearch) areaSearchStepRecursive(data, deepLevel + 1)
        } else {
            if (data.areaUnSearched.length > 0) {
                const target = data.areaUnSearched.shift()
                data.areaSearch = [target]
                data.historyMinCost.push(target)
                notFoundTargetInAreaSearch = indexOfPattern(targetPosition, data.areaSearched) === -1
                if (notFoundTargetInAreaSearch) areaSearchStepRecursive(data, deepLevel + 1)
            }
        }
    }
    areaSearchStepRecursive(newData)
    return newData
}
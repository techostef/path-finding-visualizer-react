import * as appStateAction from "../appStateAction"
import * as pathFindingStateAction from "../pathFindingStateAction"
import * as wallPositionTemplateStateAction from "../wallPositionTemplateStateAction"

export const handleIsSelectedAll = (isSelected) => {
    return (dispatch, getState) => {
        const state = getState()
        const { wallPositionTemplateState } = state
        const newData = [...wallPositionTemplateState].map((item) => {
            item.isSelected = false
            return item
        })
        dispatch(wallPositionTemplateStateAction.restoreData(newData))
    }
}

export const handleIsSelected = (id, isSelected) => {
    return (dispatch, getState) => {
        dispatch(handleIsSelectedAll(false))
        dispatch(wallPositionTemplateStateAction.setIsSelectedData(id, isSelected))
    }
}

export const implementTemplate = (id, isSelected) => {
    return (dispatch, getState) => {
        const state = getState()
        const { wallPositionTemplateState, pathFindingState } = state
        const { timerInterval } = pathFindingState
        const selectedWallPositionTemplate = wallPositionTemplateState.find((item) => item.isSelected)
        dispatch(pathFindingStateAction.setWallPosition([]))
        if (selectedWallPositionTemplate.wallPosition.length > 0) {
            const wallPosition = [...selectedWallPositionTemplate.wallPosition]
            // dispatch(appStateAction.setStartGame(true))
            let wallPositionList = []
            let interval = setInterval(() => {
                const wallPositionItem = wallPosition.shift()
                wallPositionList = [wallPositionItem, ...wallPositionList]
                dispatch(pathFindingStateAction.setWallPosition(wallPositionList))
                if (wallPosition.length === 0) {
                    clearInterval(interval)
                    // dispatch(appStateAction.setStartGame(false))
                }
            }, timerInterval / 2)
        }
    }
}
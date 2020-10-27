import { batch } from "react-redux"
import { last } from "../../../helpers/dataHelpers"
import { dPattern, isEqualPattern } from "../../../helpers/pathFindingHelper"
import * as pathFindingStateAction from "../pathFindingStateAction"

export const restartGame = () => {
    return (dispatch, getState) => {
        const state = getState()
        const { pathFindingState } = state
        const { nodePosition } = pathFindingState
        if (!pathFindingState.startGame) {
            batch(() => {
                dispatch(pathFindingStateAction.setNodePosition([last(nodePosition)]))
                dispatch(pathFindingStateAction.setAreaSearch([]))
            })
        }
    }
}

export const addOrRemoveData = (pattern = dPattern, data) => {
    return (dispatch, getState) => {
        const newData = [...data]
        const indexFind = newData.findIndex((item) => isEqualPattern(pattern, item))
        if (indexFind === -1) {
            newData.push(pattern)
        } else {
            newData.splice(indexFind, 1)
        }
        return newData
    }
}

export const addOrRemoveWall = (positionX, positionY) => {
    return (dispatch, getState) => {
        const state = getState()
        const { pathFindingState } = state
        const pattern = {x: positionX, y: positionY}
        dispatch(pathFindingStateAction.setWallPosition(dispatch(addOrRemoveData(pattern, pathFindingState.wallPosition))))
    }
}

export const handleIsSelectedAll = (isSelected) => {
    return (dispatch, getState) => {
        const state = getState()
        const { pathFindingState } = state
        const newData = [...pathFindingState.algorithm].map((item) => {
            item.isSelected = false
            return item
        })
        dispatch(pathFindingStateAction.restoreAlgorithm(newData))
    }
}

export const handleIsSelected = (id, isSelected) => {
    return (dispatch, getState) => {
        dispatch(handleIsSelectedAll(false))
        dispatch(pathFindingStateAction.setIsSelectedAlgorithm(id, isSelected))
    }
}
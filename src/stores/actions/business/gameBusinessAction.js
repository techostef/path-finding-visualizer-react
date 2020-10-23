import { batch } from "react-redux"
import { last } from "../../../helpers/dataHelpers"
import { dPattern } from "../../../helpers/gameSnakeHelpers"
import * as gameStateAction from "../gameStateAction"

export const restartGame = () => {
    return (dispatch, getState) => {
        const state = getState()
        const { gameState } = state
        if (!gameState.startGame) {
            batch(() => {
                dispatch(gameStateAction.setSnakePosition([last(gameState.snakePosition)]))
                dispatch(gameStateAction.setAreaSearch([]))
            })
        }
    }
}

export const addOrRemoveData = (pattern = dPattern, data) => {
    return (dispatch, getState) => {
        const {x: positionX, y: positionY} = pattern
        const newData = [...data]
        const indexFind = newData.findIndex((item) => item.x === positionX && item.y === positionY)
        if (indexFind === -1) {
            newData.push({x: positionX, y: positionY})
        } else {
            newData.splice(indexFind, 1)
        }
        return newData
    }
}

export const addOrRemoveWall = (positionX, positionY) => {
    return (dispatch, getState) => {
        const state = getState()
        const { gameState } = state
        
        dispatch(gameStateAction.setWallPosition(dispatch(addOrRemoveData({x: positionX, y: positionY}, gameState.wallPosition))))
    }
}
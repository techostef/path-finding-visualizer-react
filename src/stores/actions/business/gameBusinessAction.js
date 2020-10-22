import { batch } from "react-redux"
import { last } from "../../../helpers/dataHelpers"
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

export const addOrRemoveWall = (positionX, positionY) => {
    return (dispatch, getState) => {
        const state = getState()
        const { gameState } = state
        const newWallPosition = [...gameState.wallPosition]
        const indexFind = newWallPosition.findIndex((item) => item.x === positionX && item.y === positionY)
        if (indexFind === -1) {
            newWallPosition.push({x: positionX, y: positionY})
        } else {
            newWallPosition.splice(indexFind, 1)
        }
        
        dispatch(gameStateAction.setWallPosition(newWallPosition))
    }
}
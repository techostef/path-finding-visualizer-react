import actionEnums from "../../enums/actionEnums"
import { dPattern } from "../../helpers/gameSnakeHelpers"


export const setAreaSearch = (areaSearch = []) => ({
    type: actionEnums.GAME_STATE_SET_AREA_SEARCH, areaSearch
})

export const setBoarSize = (boardSize = 10) => ({
    type: actionEnums.GAME_STATE_SET_BOARD_SIZE, boardSize
})

export const setFoodPosition = (foodPosition = dPattern) => ({
    type: actionEnums.GAME_STATE_SET_FOOD_POSITION, foodPosition
})

export const setSnakePosition = (snakePosition = []) => ({
    type: actionEnums.GAME_STATE_SET_SNAKE_POSITION, snakePosition
})

export const setWallPosition = (wallPosition = []) => ({
    type: actionEnums.GAME_STATE_SET_WALL_POSITION, wallPosition
})

export const setVisualizeFinding = (visualizeFinding = false) => ({
    type: actionEnums.GAME_STATE_SET_VISUALIZE_FINDING, visualizeFinding
})

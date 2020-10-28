import actionEnums from "../../enums/actionEnums"
import { dPattern } from "../../helpers/pathFindingHelper"

export const setAreaSearch = (areaSearch = []) => ({
    type: actionEnums.GAME_STATE_SET_AREA_SEARCH, areaSearch
})

export const setBoarSize = (boardSize = 10) => ({
    type: actionEnums.GAME_STATE_SET_BOARD_SIZE, boardSize
})

export const setTargetPosition = (targetPosition = dPattern) => ({
    type: actionEnums.GAME_STATE_SET_TARGET_POSITION, targetPosition
})

export const setOptimizePath = (optimizePath = []) => ({
    type: actionEnums.GAME_STATE_SET_OPTIMIZE_PATH, optimizePath
})

export const setNodePosition = (nodePosition = []) => ({
    type: actionEnums.GAME_STATE_SET_NODE_POSITION, nodePosition
})

export const setWallPosition = (wallPosition = []) => ({
    type: actionEnums.GAME_STATE_SET_WALL_POSITION, wallPosition
})

export const setVisualizeFinding = (visualizeFinding = false) => ({
    type: actionEnums.GAME_STATE_SET_VISUALIZE_FINDING, visualizeFinding
})
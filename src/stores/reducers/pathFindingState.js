import actionEnums from "../../enums/actionEnums"

const init = {
    boardSize: 30,
    targetPosition: {x: 22, y: 12},
    nodePosition: [
      {x: 8, y: 12},
    ],
    areaSearch: [],
    wallPosition: [],
    optimizePath: true,
    timerInterval: 50,
    visualizeFinding: false,
}

const pathFindingState = (state = init, action) => {
  switch (action.type) {
    case actionEnums.GAME_STATE_SET_AREA_SEARCH:
      return Object.assign({}, state, { areaSearch: action.areaSearch})
    case actionEnums.GAME_STATE_SET_BOARD_SIZE:
      return Object.assign({}, state, { boardSize: action.boardSize})
    case actionEnums.GAME_STATE_SET_TARGET_POSITION:
      return Object.assign({}, state, { targetPosition: action.targetPosition})
    case actionEnums.GAME_STATE_SET_OPTIMIZE_PATH:
      return Object.assign({}, state, { optimizePath: action.optimizePath})
    case actionEnums.GAME_STATE_SET_NODE_POSITION:
      return Object.assign({}, state, { nodePosition: action.nodePosition})
    case actionEnums.GAME_STATE_SET_VISUALIZE_FINDING:
      return Object.assign({}, state, { visualizeFinding: action.visualizeFinding})
    case actionEnums.GAME_STATE_SET_WALL_POSITION:
      return Object.assign({}, state, { wallPosition: action.wallPosition})
    default:
        return state;
  }
};

export default pathFindingState
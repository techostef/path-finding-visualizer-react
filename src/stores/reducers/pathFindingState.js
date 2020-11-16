import actionEnums from "../../enums/actionEnums"

const init = {
    boardSize: 30,
    targetPosition: {x: 22, y: 12},
    // targetPosition: {x: 15, y: 16},
    nodePosition: [
      {x: 8, y: 12},
      // {x: 7, y: 11},
    ],
    areaSearch: [],
    wallPosition: [],
    // wallPosition: [{"x":9,"y":14},{"x":9,"y":15},{"x":9,"y":12},{"x":10,"y":12},{"x":12,"y":12},{"x":11,"y":12},{"x":9,"y":16},{"x":11,"y":15},{"x":11,"y":14},{"x":9,"y":17},{"x":11,"y":13},{"x":10,"y":17},{"x":11,"y":17},{"x":12,"y":17},{"x":13,"y":16},{"x":13,"y":15},{"x":13,"y":14},{"x":13,"y":17},{"x":13,"y":12},{"x":14,"y":12},{"x":14,"y":17},{"x":16,"y":17},{"x":15,"y":17},{"x":17,"y":17},{"x":16,"y":12},{"x":17,"y":12},{"x":18,"y":12},{"x":18,"y":13},{"x":18,"y":14},{"x":18,"y":17},{"x":18,"y":15},{"x":18,"y":16}],
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
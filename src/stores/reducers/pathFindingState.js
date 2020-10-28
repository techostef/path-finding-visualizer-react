import actionEnums from "../../enums/actionEnums"

const init = {
    algorithm: [
      {
        id: 1,
        label: "Breath First Search",
        isSelected: false,
      },
      {
        id: 2,
        label: "Deep First Search",
        isSelected: false,
      },
      {
        id: 3,
        label: "A* Search",
        isSelected: true,
      },
    ],
    boardSize: 30,
    // targetPosition: {x: 5, y: 1},
    targetPosition: {x: 22, y: 18},
    // snakePosition: [dPattern],
    nodePosition: [
      // {x: 8, y: 4},
      {x: 4, y: 13},
    ],
    areaSearch: [
    ],
    wallPosition: [
      {
        "x": 6,
        "y": 14
      },
      {
        "x": 7,
        "y": 14
      },
      {
        "x": 8,
        "y": 14
      },
      {
        "x": 9,
        "y": 14
      },
      {
        "x": 10,
        "y": 14
      },
      {
        "x": 12,
        "y": 14
      },
      {
        "x": 13,
        "y": 14
      },
      {
        "x": 14,
        "y": 14
      },
      {
        "x": 17,
        "y": 14
      },
      {
        "x": 18,
        "y": 14
      },
      {
        "x": 20,
        "y": 14
      },
      {
        "x": 21,
        "y": 14
      },
      {
        "x": 22,
        "y": 14
      },
      {
        "x": 23,
        "y": 14
      },
      {
        "x": 24,
        "y": 14
      },
      {
        "x": 25,
        "y": 14
      },
      {
        "x": 26,
        "y": 14
      },
      {
        "x": 27,
        "y": 14
      },
      {
        "x": 28,
        "y": 14
      },
      {
        "x": 29,
        "y": 14
      },
      {
        "x": 0,
        "y": 19
      },
      {
        "x": 1,
        "y": 19
      },
      {
        "x": 2,
        "y": 19
      },
      {
        "x": 3,
        "y": 19
      },
      {
        "x": 4,
        "y": 19
      },
      {
        "x": 5,
        "y": 19
      },
      {
        "x": 6,
        "y": 19
      },
      {
        "x": 7,
        "y": 19
      },
      {
        "x": 8,
        "y": 19
      },
      {
        "x": 9,
        "y": 19
      },
      {
        "x": 10,
        "y": 19
      },
      {
        "x": 11,
        "y": 19
      },
      {
        "x": 12,
        "y": 19
      },
      {
        "x": 13,
        "y": 19
      },
      {
        "x": 14,
        "y": 19
      },
      {
        "x": 15,
        "y": 19
      },
      {
        "x": 16,
        "y": 19
      },
      {
        "x": 17,
        "y": 19
      },
      {
        "x": 18,
        "y": 19
      },
      {
        "x": 19,
        "y": 19
      },
      {
        "x": 20,
        "y": 19
      },
      {
        "x": 21,
        "y": 19
      },
      {
        "x": 22,
        "y": 19
      },
      {
        "x": 23,
        "y": 19
      },
      {
        "x": 23,
        "y": 18
      },
      {
        "x": 23,
        "y": 17
      },
      {
        "x": 23,
        "y": 16
      },
      {
        "x": 23,
        "y": 15
      },
      {
        "x": 6,
        "y": 16
      },
      {
        "x": 6,
        "y": 17
      },
      {
        "x": 6,
        "y": 18
      },
      {
        "x": 8,
        "y": 17
      },
      {
        "x": 8,
        "y": 16
      },
      {
        "x": 8,
        "y": 15
      },
      {
        "x": 10,
        "y": 16
      },
      {
        "x": 10,
        "y": 17
      },
      {
        "x": 11,
        "y": 14
      },
      {
        "x": 10,
        "y": 18
      },
      {
        "x": 19,
        "y": 14
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 6,
        "y": 2
      },
      {
        "x": 7,
        "y": 2
      },
      {
        "x": 8,
        "y": 2
      },
      {
        "x": 10,
        "y": 15
      },
      {
        "x": 16,
        "y": 14
      }
    ],
    optimizePath: true,
    timerInterval: 50,
    visualizeFinding: false,
}

const appState = (state = init, action) => {
  let findIndex, newData
  switch (action.type) {
    case actionEnums.GAME_STATE_SET_ALGORITHM_IS_SELECTED:
      newData = [...state.algorithm].map((item) => Object.assign({}, item))
      findIndex = newData.findIndex((item) => item.id === action.id)
      newData[findIndex].isSelected = action.isSelected
      state.algorithm = [...newData]
      return Object.assign({}, state)
    case actionEnums.GAME_STATE_RESTORE_ALGORITHM:
      state.algorithm = action.data
      return state
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

export default appState
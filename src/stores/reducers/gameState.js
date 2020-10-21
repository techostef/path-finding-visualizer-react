import actionEnums from "../../enums/actionEnums"
// import { dPattern } from "../../helpers/gameSnakeHelpers";

const init = {
    boardSize: 15,
    // foodPosition: Object.assign({}, dPattern, {x: 4, y: 4}),
    visualizeFinding: false,
    foodPosition: {
      "x": 12,
      "y": 3
    },
    // snakePosition: [dPattern],
    snakePosition: [
      {
        "x": 3,
        "y": 11
      }
    ],
    wallPosition: [
      {
        "x": 11,
        "y": 4
      },
      {
        "x": 11,
        "y": 3
      },
      {
        "x": 11,
        "y": 2
      },
      {
        "x": 12,
        "y": 2
      },
      {
        "x": 13,
        "y": 2
      },
      {
        "x": 13,
        "y": 3
      },
      {
        "x": 11,
        "y": 5
      },
      {
        "x": 12,
        "y": 5
      },
      {
        "x": 13,
        "y": 5
      },
      {
        "x": 14,
        "y": 5
      },
      {
        "x": 9,
        "y": 4
      },
      {
        "x": 9,
        "y": 5
      },
      {
        "x": 9,
        "y": 6
      },
      {
        "x": 9,
        "y": 7
      },
      {
        "x": 9,
        "y": 8
      },
      {
        "x": 9,
        "y": 9
      },
      {
        "x": 9,
        "y": 10
      },
      {
        "x": 9,
        "y": 12
      },
      {
        "x": 9,
        "y": 13
      },
      {
        "x": 9,
        "y": 14
      },
      {
        "x": 7,
        "y": 1
      },
      {
        "x": 7,
        "y": 2
      },
      {
        "x": 7,
        "y": 3
      },
      {
        "x": 7,
        "y": 4
      },
      {
        "x": 7,
        "y": 0
      },
      {
        "x": 9,
        "y": 3
      },
      {
        "x": 9,
        "y": 2
      },
      {
        "x": 9,
        "y": 1
      },
      {
        "x": 9,
        "y": 0
      },
      {
        "x": 7,
        "y": 6
      },
      {
        "x": 7,
        "y": 7
      },
      {
        "x": 7,
        "y": 8
      },
      {
        "x": 7,
        "y": 9
      },
      {
        "x": 7,
        "y": 10
      },
      {
        "x": 7,
        "y": 11
      },
      {
        "x": 7,
        "y": 12
      },
      {
        "x": 7,
        "y": 13
      },
      {
        "x": 7,
        "y": 14
      },
      {
        "x": 10,
        "y": 9
      },
      {
        "x": 11,
        "y": 9
      },
      {
        "x": 11,
        "y": 10
      },
      {
        "x": 10,
        "y": 12
      },
      {
        "x": 11,
        "y": 12
      },
      {
        "x": 12,
        "y": 12
      },
      {
        "x": 13,
        "y": 12
      },
      {
        "x": 13,
        "y": 11
      },
      {
        "x": 13,
        "y": 10
      },
      {
        "x": 13,
        "y": 9
      },
      {
        "x": 13,
        "y": 8
      },
      {
        "x": 13,
        "y": 7
      },
      {
        "x": 10,
        "y": 7
      },
      {
        "x": 11,
        "y": 7
      },
      {
        "x": 6,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      },
      {
        "x": 6,
        "y": 6
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 4,
        "y": 6
      },
      {
        "x": 4,
        "y": 7
      },
      {
        "x": 4,
        "y": 8
      },
      {
        "x": 4,
        "y": 9
      },
      {
        "x": 4,
        "y": 10
      },
      {
        "x": 5,
        "y": 8
      },
      {
        "x": 6,
        "y": 10
      },
      {
        "x": 0,
        "y": 10
      },
      {
        "x": 1,
        "y": 10
      },
      {
        "x": 2,
        "y": 10
      },
      {
        "x": 3,
        "y": 10
      }
    ],
}

const appState = (state = init, action) => {
    switch (action.type) {
        case actionEnums.GAME_STATE_SET_BOARD_SIZE:
            return Object.assign({}, state, { boardSize: action.boardSize})
        case actionEnums.GAME_STATE_SET_FOOD_POSITION:
            return Object.assign({}, state, { foodPosition: action.foodPosition})
        case actionEnums.GAME_STATE_SET_SNAKE_POSITION:
            return Object.assign({}, state, { snakePosition: action.snakePosition})
        case actionEnums.GAME_STATE_SET_VISUALIZE_FINDING:
            return Object.assign({}, state, { visualizeFinding: action.visualizeFinding})
        case actionEnums.GAME_STATE_SET_WALL_POSITION:
            return Object.assign({}, state, { wallPosition: action.wallPosition})
        default:
            return state;
    }
};

export default appState
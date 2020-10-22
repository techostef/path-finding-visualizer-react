import actionEnums from "../../enums/actionEnums"
// import { dPattern } from "../../helpers/gameSnakeHelpers";

const init = {
    boardSize: 15,
    // foodPosition: Object.assign({}, dPattern, {x: 4, y: 4}),
    
    foodPosition: {x: 11, y: 12},
    // snakePosition: [dPattern],
    snakePosition: [
        {"x":2,"y":2}
    ],
    areaSearch: [
    ],
    wallPosition: [
        {
          "x": 9,
          "y": 5
        },
        {
          "x": 9,
          "y": 7
        },
        {
          "x": 9,
          "y": 10
        },
        {
          "x": 9,
          "y": 11
        },
        {
          "x": 9,
          "y": 13
        },
        {
          "x": 9,
          "y": 12
        },
        {
          "x": 9,
          "y": 9
        },
        {
          "x": 9,
          "y": 8
        },
        {
          "x": 9,
          "y": 6
        },
        {
          "x": 10,
          "y": 10
        },
        {
          "x": 11,
          "y": 10
        },
        {
          "x": 12,
          "y": 10
        },
        {
          "x": 14,
          "y": 10
        },
        {
          "x": 13,
          "y": 10
        },
        {
          "x": 2,
          "y": 5
        },
        {
          "x": 3,
          "y": 5
        },
        {
          "x": 4,
          "y": 5
        },
        {
          "x": 5,
          "y": 5
        },
        {
          "x": 7,
          "y": 5
        },
        {
          "x": 6,
          "y": 5
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 5,
          "y": 3
        },
        {
          "x": 6,
          "y": 3
        },
        {
          "x": 7,
          "y": 3
        },
        {
          "x": 8,
          "y": 3
        },
        {
          "x": 9,
          "y": 3
        }
    ],
    optimizePath: true,
    visualizeFinding: false,
}

const appState = (state = init, action) => {
    switch (action.type) {
        case actionEnums.GAME_STATE_SET_AREA_SEARCH:
            return Object.assign({}, state, { areaSearch: action.areaSearch})
        case actionEnums.GAME_STATE_SET_BOARD_SIZE:
            return Object.assign({}, state, { boardSize: action.boardSize})
        case actionEnums.GAME_STATE_SET_FOOD_POSITION:
            return Object.assign({}, state, { foodPosition: action.foodPosition})
        case actionEnums.GAME_STATE_SET_OPTIMIZE_PATH:
            return Object.assign({}, state, { optimizePath: action.optimizePath})
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
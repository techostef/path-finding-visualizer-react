import actionEnums from "../../enums/actionEnums"
// import { dPattern } from "../../helpers/gameSnakeHelpers";

const init = {
    boardSize: 15,
    // foodPosition: Object.assign({}, dPattern, {x: 4, y: 4}),
    visualizeFinding: false,
    foodPosition: {
      "x": 3,
      "y": 3
    },
    // snakePosition: [dPattern],
    snakePosition: [
      {
        "x": 6,
        "y": 3
      }
    ],
    wallPosition: [
      
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
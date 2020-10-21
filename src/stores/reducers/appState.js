import actionEnums from "../../enums/actionEnums"

const init = {
    startGame: false
}

const appState = (state = init, action) => {
    switch (action.type) {
        case actionEnums.APP_STATE_SET_START_GAME:
            return Object.assign({}, state, { startGame: action.startGame})
        default:
            return state;
    }
};

export default appState
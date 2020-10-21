import actionEnums from "../../enums/actionEnums"

export const setStartGame = (startGame) => ({
    type: actionEnums.APP_STATE_SET_START_GAME, startGame
})
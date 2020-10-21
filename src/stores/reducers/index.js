import { combineReducers } from 'redux';

// New ------------------------------------------------------
import appState from './appState';
import gameState from './gameState';

export default combineReducers({
    appState,
    gameState,
});
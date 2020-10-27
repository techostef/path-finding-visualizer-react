import { combineReducers } from 'redux';

// New ------------------------------------------------------
import appState from './appState';
import pathFindingState from './pathFindingState';

export default combineReducers({
    appState,
    pathFindingState,
});
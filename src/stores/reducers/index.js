import { combineReducers } from 'redux';

// New ------------------------------------------------------
import appState from './appState';
import algorithmState from './algorithmState';
import pathFindingState from './pathFindingState';
import wallPositionTemplateState from './wallPositionTemplateState';

export default combineReducers({
    appState,
    algorithmState,
    pathFindingState,
    wallPositionTemplateState,
});
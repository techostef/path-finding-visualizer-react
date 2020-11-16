import React from "react"
import "./BoardHeader.scss"
import { Button } from 'react-bootstrap'
import * as appStateAction from "../stores/actions/appStateAction"
import * as algorithmBusinessAction from "../stores/actions/business/algorithmBusinessAction"
import * as pathFindingBusinessAction from "../stores/actions/business/pathFindingBusinessAction"
import * as pathFindingStateAction from "../stores/actions/pathFindingStateAction"
import * as wallPositionTemplateBusinessAction from "../stores/actions/business/wallPositionTemplateBusinessAction"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import InputRange from "../components/inputs/InputRange"
import { dPattern } from "../helpers/pathFindingHelper"
import ButtonOptions from "../components/inputs/ButtonOptions"

const mapStateToProps = (state) => {
    return {
        algorithmState: state.algorithmState,
        wallPositionTemplateState: state.wallPositionTemplateState,
        boardSize: state.pathFindingState.boardSize,
        optimizePath: state.pathFindingState.optimizePath,
        nodePosition: state.pathFindingState.nodePosition,
        startGame: state.appState.startGame,
        visualizeFinding: state.pathFindingState.visualizeFinding,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        appStateAction: bindActionCreators(appStateAction, dispatch),
        algorithmBusinessAction: bindActionCreators(algorithmBusinessAction, dispatch),
        pathFindingBusinessAction: bindActionCreators(pathFindingBusinessAction, dispatch),
        pathFindingStateAction: bindActionCreators(pathFindingStateAction, dispatch),
        wallPositionTemplateBusinessAction: bindActionCreators(wallPositionTemplateBusinessAction, dispatch),
    }
}

const BoardHeader = (props) => {
    const startStopGame = () => {
        const { appStateAction, startGame } = props
        appStateAction.setStartGame(!startGame)
    }

    const isSelectedAlgorithm = props.algorithmState.find((item) => item.isSelected)
    const isSelectedWallPositionTemplate = props.wallPositionTemplateState.find((item) => item.isSelected)

    const restartGame = () => {
        const { pathFindingBusinessAction, startGame } = props
        if (!startGame) {
            pathFindingBusinessAction.restartGame()
        }
    }

    const onChangeBoardSize = (e) => {
        const { pathFindingStateAction } = props
        const boardSize = parseInt(e.target.value)
        pathFindingStateAction.setBoarSize(boardSize < 4 ? 4 : boardSize)
        pathFindingStateAction.setSnakePosition([dPattern])
    }

    const clearWallPosition = (e) => {
        const { pathFindingStateAction } = props
        pathFindingStateAction.setWallPosition([])
    }

    const handleVisualizeFinding = (e) => {
        const { pathFindingStateAction } = props
        pathFindingStateAction.setVisualizeFinding(true)
        pathFindingStateAction.setOptimizePath(false)
    }

    const onChangeAlgorithm = (item) => {
        const { algorithmBusinessAction } = props
        algorithmBusinessAction.handleIsSelected(item.id, true)
    }

    const onChangeWallPositionTemplate = (item) => {
        const { wallPositionTemplateBusinessAction } = props
        wallPositionTemplateBusinessAction.handleIsSelected(item.id, true)
    }

    const handleOptimizePath = (e) => {
        const { pathFindingStateAction } = props
        pathFindingStateAction.setVisualizeFinding(false)
        pathFindingStateAction.setOptimizePath(true)
    }

    const doImplementWallPositionTemplate = (e) => {
        const { wallPositionTemplateBusinessAction } = props
        wallPositionTemplateBusinessAction.implementTemplate()
    }

    return (
        <div className="board-header">
            
            {/* <div className="board-size-control">
                <div className="text-content">
                    Visualize Finding
                </div>
                <input type="radio" name="wayinput" disabled={props.startGame} defaultChecked={props.visualizeFinding} onChange={handleVisualizeFinding} />
            </div>
            <div className="board-size-control">
                <div className="text-content">
                    Optimize Path
                </div>
                <input type="radio" name="wayinput" disabled={props.startGame} defaultChecked={props.optimizePath} onChange={handleOptimizePath} />
            </div> */}
            <ButtonOptions 
                disabled={props.startGame || props.nodePosition.length > 1}
                onClick={startStopGame}
                labelKey={'label'}
                options={props.algorithmState}
                valueKey={'id'}
                onChangeOptions={onChangeAlgorithm}
                value={isSelectedAlgorithm && isSelectedAlgorithm.id}
            />
            <ButtonOptions 
                className="wall-position-template"
                disabled={props.startGame || props.nodePosition.length > 1}
                // onClick={doImplementWallPositionTemplate}
                labelKey={'label'}
                options={props.wallPositionTemplateState}
                valueKey={'id'}
                onChangeOptions={onChangeWallPositionTemplate}
                value={isSelectedWallPositionTemplate && isSelectedWallPositionTemplate.id}
            />
            <Button 
                disabled={props.startGame}
                className="restart-button" 
                onClick={clearWallPosition}
            >
                Clear Wall 
            </Button>
            <Button 
                disabled={props.startGame}
                className="restart-button" 
                onClick={restartGame}
            >
                Clear Path
            </Button>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(BoardHeader))
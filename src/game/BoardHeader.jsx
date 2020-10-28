import React from "react"
import "./BoardHeader.scss"
import { Button } from 'react-bootstrap'
import * as appStateAction from "../stores/actions/appStateAction"
import * as pathFindingBusinessAction from "../stores/actions/business/pathFindingBusinessAction"
import * as pathFindingStateAction from "../stores/actions/pathFindingStateAction"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import InputRange from "../components/inputs/InputRange"
import { dPattern } from "../helpers/pathFindingHelper"
import ButtonOptions from "../components/inputs/ButtonOptions"

const mapStateToProps = (state) => {
    return {
        algorithm: state.pathFindingState.algorithm,
        boardSize: state.pathFindingState.boardSize,
        optimizePath: state.pathFindingState.optimizePath,
        startGame: state.appState.startGame,
        visualizeFinding: state.pathFindingState.visualizeFinding,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        appStateAction: bindActionCreators(appStateAction, dispatch),
        pathFindingBusinessAction: bindActionCreators(pathFindingBusinessAction, dispatch),
        pathFindingStateAction: bindActionCreators(pathFindingStateAction, dispatch),
    }
}

const BoardHeader = (props) => {
    const startStopGame = () => {
        const { appStateAction, startGame } = props
        appStateAction.setStartGame(!startGame)
    }

    const isSelectedAlgorithm = props.algorithm.find((item) => item.isSelected)

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
        const { pathFindingBusinessAction } = props
        pathFindingBusinessAction.handleIsSelected(item.id, true)
    }

    const handleOptimizePath = (e) => {
        const { pathFindingStateAction } = props
        pathFindingStateAction.setVisualizeFinding(false)
        pathFindingStateAction.setOptimizePath(true)
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
                disabled={props.startGame}
                onClick={startStopGame}
                labelKey={'label'}
                options={props.algorithm}
                valueKey={'id'}
                onChangeOptions={onChangeAlgorithm}
                value={isSelectedAlgorithm && isSelectedAlgorithm.id}
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
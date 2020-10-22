import React from "react"
import "./BoardHeader.scss"
import { Button } from 'react-bootstrap'
import * as appStateAction from "../stores/actions/appStateAction"
import * as gameBusinessAction from "../stores/actions/business/gameBusinessAction"
import * as gameStateAction from "../stores/actions/gameStateAction"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import InputRange from "../components/inputs/InputRange"
import { dPattern } from "../helpers/gameSnakeHelpers"

const mapStateToProps = (state) => {
    return {
        boardSize: state.gameState.boardSize,
        startGame: state.appState.startGame,
        visualizeFinding: state.gameState.visualizeFinding,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        appStateAction: bindActionCreators(appStateAction, dispatch),
        gameBusinessAction: bindActionCreators(gameBusinessAction, dispatch),
        gameStateAction: bindActionCreators(gameStateAction, dispatch),
    }
}

const BoardHeader = (props) => {
    const startStopGame = () => {
        const { appStateAction, startGame } = props
        appStateAction.setStartGame(!startGame)
    }

    const restartGame = () => {
        const { gameBusinessAction, startGame } = props
        if (!startGame) {
            gameBusinessAction.restartGame()
        }
    }

    const onChangeBoardSize = (e) => {
        const { gameStateAction } = props
        const boardSize = parseInt(e.target.value)
        gameStateAction.setBoarSize(boardSize < 4 ? 4 : boardSize)
        gameStateAction.setSnakePosition([dPattern])

    }

    const clearWallPosition = (e) => {
        const { gameStateAction } = props
        gameStateAction.setWallPosition([])
    }

    const handleVisualizeFinding = (e) => {
        const { gameStateAction } = props
        gameStateAction.setVisualizeFinding(!props.visualizeFinding)
    }

    return (
        <div className="board-header">
            <div className="board-size-control">
                <div className="text-content">
                    Board Size
                </div>
                <InputRange 
                    disabled={props.startGame}
                    value={props.boardSize} 
                    min={3}
                    max={100}
                    onChange={onChangeBoardSize} 
                />
            </div>
            <div className="board-size-control">
                <div className="text-content">
                    Visualize Finding
                </div>
                <input type="checkbox" disabled={props.startGame} defaultChecked={props.visualizeFinding.chkbox} onChange={handleVisualizeFinding} />
            </div>
            <Button 
                className="start-button" 
                onClick={startStopGame}
            >
                {props.startGame ? "Stop" : "Start"}
            </Button>
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
                Restart Game
            </Button>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(BoardHeader))
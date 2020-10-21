import React from "react"
import "./BoardContainer.scss"

const BoardContainer = (props) => {
    return (
        <div className="board-container">
            {props.children}
        </div>
    )
}

export default React.memo(BoardContainer)
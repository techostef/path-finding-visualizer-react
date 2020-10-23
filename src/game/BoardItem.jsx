import React from "react"
import { last } from "../helpers/dataHelpers"
import { getRotate, isEqualPattern } from "../helpers/gameSnakeHelpers"
import { ReactComponent as StartNodeIcon } from "../images/startNode.svg"
import TargetItem from "./TargetItem"

const BoardItem = (props) => {
    const { indexX, indexY, isAreaSearch, isPositionNode, isWall, nodePosition, targetPosition } = props
    console.log('boardItem render')
    return (
        <div
            key={`board-item-${indexX}-${indexY}`} 
            onMouseOver={() => props.addOrRemoveWall(indexX, indexY)}
            onMouseDown={(e) => props.setWallActive(e, 'check', indexX, indexY)}
            className={`board-item ${isWall} ${isAreaSearch} ${isPositionNode}`}
        >
            {isEqualPattern(nodePosition[0], {x: indexX, y: indexY}) && <div className="container-icon"><StartNodeIcon style={{transform: `rotate(${getRotate(nodePosition[1] || nodePosition[0], nodePosition[0])}deg)`}}/></div>}
            {nodePosition.length > 1 && isEqualPattern(last(nodePosition), {x: indexX, y: indexY}) && <div className="container-icon"><StartNodeIcon/></div>}
            {isEqualPattern(targetPosition, {x: indexX, y: indexY}) && !isEqualPattern(nodePosition[0], {x: indexX, y: indexY}) && <TargetItem/>}
            {/* {isEqualPattern(snakePosition[snakePosition.length - 1], {x: indexX, y: indexY}) && <div className="container-icon"><StartNodeIcon/></div>} */}
            {/* <div>
                x: {indexX}
            </div>
            <div>
                y: {indexY}
            </div> */}
        </div>
    )
}

const isEqual = (prevProps, nextProps) => {
    return (prevProps.indexX === nextProps.indexX) &&
    (prevProps.indexY === nextProps.indexY) &&
    (prevProps.isAreaSearch === nextProps.isAreaSearch) &&
    (prevProps.isPositionNode === nextProps.isPositionNode) &&
    (prevProps.isWall === nextProps.isWall) &&
    (prevProps.nodePosition === nextProps.nodePosition) &&
    (prevProps.targetPosition === nextProps.targetPosition)
}

export default React.memo(BoardItem, isEqual)
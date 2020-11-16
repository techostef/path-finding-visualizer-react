import React from 'react'
import { last } from '../helpers/dataHelpers'
import { getRotate, indexOfPattern, isEqualPattern } from '../helpers/pathFindingHelper'
import { ReactComponent as StartNodeIcon } from "../images/startNode.svg"
import TargetItem from "./TargetItem"
import PropTypes from 'prop-types'
import { isEqualArrayOfObject, isEqualObject } from '../helpers/validationDataHelpers'

const BoardComponentItem = (props) => {
    const {
        indexX,
        indexY,
        addOrRemoveWall,
        setWallActive,
        checkAreaSearch,
        checkPositionNode,
        checkWallPosition,
        headNode,
        nodePosition,
        targetPosition,
        patternCurrent,
    } = props;
    return (
        <div
            key={`board-item-${indexX}-${indexY}`} 
            onMouseEnter={() => addOrRemoveWall(indexX, indexY)}
            onMouseDown={(e) => setWallActive(e, 'check', indexX, indexY)}
            className={`board-item ${props.startGame ? 'animated' : ''} ${checkAreaSearch(indexX, indexY)} ${checkPositionNode(indexX, indexY)}`}
        >   
            <div className={`board-item unborder ${checkWallPosition(indexX, indexY)}`}>
                {/* {!isEqualPattern(headNode, {x: indexX, y: indexY}) && !isEqualPattern(last(nodePosition), {x: indexX, y: indexY}) && (
                    <div style={{position: "absolute"}} title={getTotalCost(patternCurrent, areaSearch)}>
                        <div>x: {indexX}</div>
                        <div>y: {indexY}</div>
                    </div>
                )} */}
                {/* <div style={{position: "absolute"}}>
                    {getTotalCost(patternCurrent, areaSearch)}
                </div> */}
                {isEqualPattern(headNode, patternCurrent) && <div className="container-icon"><StartNodeIcon style={{transform: `rotate(${getRotate(nodePosition[1] || headNode, headNode)}deg)`}}/></div>}
                {nodePosition.length > 1 && isEqualPattern(last(nodePosition), patternCurrent) && <div className="container-icon"><StartNodeIcon style={{transform: `rotate(${getRotate(last(nodePosition), headNode)}deg)`}}/></div>}
                {isEqualPattern(targetPosition, patternCurrent) && indexOfPattern(targetPosition, nodePosition) === -1 && <TargetItem/>}
            </div>
        </div>
    )
}

BoardComponentItem.propTypes = {
    indexX: PropTypes.number,
    indexY: PropTypes.number,
    addOrRemoveWall: PropTypes.func,
    setWallActive: PropTypes.func,
    checkAreaSearch: PropTypes.func,
    checkPositionNode: PropTypes.func,
    checkWallPosition: PropTypes.func,
    headNode: PropTypes.object,
    nodePosition: PropTypes.arrayOf(PropTypes.object),
    targetPosition: PropTypes.object,
    patternCurrent: PropTypes.object,
}

const areEqual = (prevProps, nextProps) => {
    return (prevProps.indexX === nextProps.indexX) &&
    (prevProps.indexY === nextProps.indexY) &&
    (isEqualObject(prevProps.headNode, nextProps.headNode)) &&
    (isEqualArrayOfObject(prevProps.nodePosition, nextProps.nodePosition)) &&
    (isEqualObject(prevProps.nodePosition, nextProps.nodePosition))
}

export default React.memo(BoardComponentItem, areEqual)
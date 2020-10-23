import React from "react"
import "./TargetItem.scss"

const TargetItem = (props) => {
    return (
        <div className="container-target">
            <div className="content-target">
                <div className="target-item">
                    <div className="target-item-circle"></div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(TargetItem)
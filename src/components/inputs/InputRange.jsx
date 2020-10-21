import React from "react"
import "./InputRange.scss"
import PropTypes from "prop-types"

const  InputRange = (props) => {
    return (
        <div className="range-array">
            <div className="input-container">
                <input 
                    type="range"
                    disabled={props.disabled}
                    min={props.min} 
                    max={props.max}
                    value={props.value}
                    onChange={props.onChange}
                />
                <input 
                    className="input-text"
                    disabled={props.disabled}
                    type="text"  
                    value={props.value}
                    onChange={props.onChange}
                />
            </div>
            {props.label && props.label.length && <label>{props.label}</label>}
        </div>
    )
}

InputRange.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.any,
    max: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func,
}

export default React.memo(InputRange)
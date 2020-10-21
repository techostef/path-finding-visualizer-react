import React from 'react'
import PropTypes from 'prop-types'

const InputDropDown = (props) => {
    const onChange = (e) => {
        console.log("e", e.target.value)
        const item = props.options.find((item) => item[props.valueKey] == e.target.value)
        props.onChange(item)
    }
    return (
        <select onChange={onChange}>
            {props.options.map((item, index) => {
                return (
                    <option key={`input-drop-down${index}`} value={item[props.valueKey]}>
                        {item[props.labelKey]}
                    </option>
                )
            })}
        </select>
    )
}

InputDropDown.propTypes = {
    labelKey: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
    valueKey: PropTypes.string,
}

InputDropDown.defaultProps = {
    labelKey: "name",
    onChange: () => {},
    options: [],
    valueKey: "Id",
}

export default React.memo(InputDropDown)
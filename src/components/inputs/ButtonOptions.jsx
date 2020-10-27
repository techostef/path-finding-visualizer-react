import React, { useMemo, useRef, useState } from "react"
import PropTypes from "prop-types"
import "./ButtonOptions.scss"
import { Button } from 'react-bootstrap'
import { ReactComponent as RightArrowIcon } from '../../images/rightArrow.svg'
import { useOutsideClick } from "../../helpers/hookHelpers"

const ButtonOptions = (props) => {
    const { labelKey, valueKey } = props
    const findItem = props.options.find((item) => item[valueKey] === props.value)
    const value = findItem[labelKey]

    const optionRef = useRef()

    const [openOptions, setOpenOptions] = useState(false)

    useOutsideClick(optionRef, () => {
        if (openOptions) setOpenOptions(false)
    });

    const onClickOptionItem = (item, index) => {
        props.onChangeOptions(item, index)
        setOpenOptions(false)
    }

    console.log("renderButtonOptions", props)

    return (
        <div className="button-options">
            <Button 
                disabled={props.disabled}
                className="button-content" 
                onClick={props.onClick}>
                <div className="label">
                    {value}
                </div>
            </Button>
            <div className="icon-container">
                <RightArrowIcon onClick={() => setOpenOptions(!openOptions)}/>
                {openOptions && <div ref={optionRef} className="container-options">
                    {props.options.map((item, index) => 
                        <div 
                            key={`option-item-${index}`} 
                            className="option-item" 
                            onClick={() => onClickOptionItem(item, index)}
                        >
                            {item[props.labelKey]}
                        </div>
                    )}
                </div>}
            </div>
        </div>
    )
}

ButtonOptions.defaultProps = {
    disabled: false,
    labelKey: 'name',
    onClick: () => {},
    onChangeOptions: () => {},
    valueKey: 'id',
    value: null,
    options: [],
}

ButtonOptions.propTypes = {
    disabled: PropTypes.bool,
    labelKey: PropTypes.string,
    onClick: PropTypes.func,
    onChangeOptions: PropTypes.func,
    valueKey: PropTypes.string,
    value: PropTypes.any,
    options: PropTypes.array,
}

export default React.memo(ButtonOptions)
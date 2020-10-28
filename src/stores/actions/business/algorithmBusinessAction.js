import * as algorithmStateAction from "../algorithmStateAction"

export const handleIsSelectedAll = (isSelected) => {
    return (dispatch, getState) => {
        const state = getState()
        const { algorithmState } = state
        const newData = [...algorithmState].map((item) => {
            item.isSelected = false
            return item
        })
        dispatch(algorithmStateAction.restoreData(newData))
    }
}

export const handleIsSelected = (id, isSelected) => {
    return (dispatch, getState) => {
        dispatch(handleIsSelectedAll(false))
        dispatch(algorithmStateAction.setIsSelectedData(id, isSelected))
    }
}
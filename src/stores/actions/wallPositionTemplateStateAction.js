import actionEnums from "../../enums/actionEnums"

export const setIsSelectedData = (id = 0, isSelected = false) => ({
    type: actionEnums.WALL_POSITION_TEMPLATE_STATE_SET_IS_SELECTED, id, isSelected
})

export const restoreData = (data = []) => ({
    type: actionEnums.WALL_POSITION_TEMPLATE_STATE_RESTORE_DATA, data
})
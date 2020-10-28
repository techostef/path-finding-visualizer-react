import actionEnums from "../../enums/actionEnums"

const init = [
  {
    id: 1,
    label: "Breath First Search",
    isSelected: false,
  },
  {
    id: 2,
    label: "Deep First Search",
    isSelected: false,
  },
  {
    id: 3,
    label: "A* Search",
    isSelected: true,
  },
]

const algorithmState = (state = init, action) => {
  let findIndex, newData
  switch (action.type) {
    case actionEnums.ALGORITHM_STATE_SET_IS_SELECTED:
      newData = [...state].map((item) => Object.assign({}, item))
      findIndex = newData.findIndex((item) => item.id === action.id)
      newData[findIndex].isSelected = action.isSelected
      return [...newData]
    case actionEnums.ALGORITHM_STATE_RESTORE_DATA:
      return action.data
    default:
        return state;
  }
};

export default algorithmState
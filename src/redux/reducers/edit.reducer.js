const editReducer = (state = {}, action) => {
    if (action.type === 'EDIT_STUDENT') {
        return action.payload;
    }
    // if (action.type === 'EDIT_ONCHANGE') {
    //     return {
    //         ...state,
    //         [action.payload.property]: action.payload.value
    //     }
    // }
    if (action.type === 'EDIT_ONCHANGE') {
        if (state.id === action.payload.id) {
          return {
            ...state,
            [action.payload.property]: action.payload.value,
          };
        }
        return state;
      }
    return state;
}

export default editReducer;
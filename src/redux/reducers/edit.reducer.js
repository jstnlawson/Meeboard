const editReducer = (state = {}, action) => {
    if (action.type === 'EDIT_STUDENT') {
        return action.payload;
    }
    if (action.type === 'EDIT_ONCHANGE') {
        return {
            ...state,
            [action.payload.property]: action.payload.value
        }
    }
    return state;
}

export default editReducer;
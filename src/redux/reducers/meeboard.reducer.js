const meeboardReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_SAMPLE':
            return action.payload;
        default:
            return state;
    }
};



export default meeboardReducer;
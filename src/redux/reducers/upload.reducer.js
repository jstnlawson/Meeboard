const uploadReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_UPLOADS':
            return action.payload;
        case 'ADD_UPLOAD':
            return [...state, action.payload]
            case 'DELETE_UPLOAD':
      
      console.log('Deleting sample with id:', action.payload);
      return state.filter(upload => upload.id !== action.payload);
        default:
            return state;
    }
};



export default uploadReducer;

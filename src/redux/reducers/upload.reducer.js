 const uploadReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_UPLOADS':
        return [ ...state, action.payload]
      default:
        return state;
    }
  };
  
  export default uploadReducer;
  
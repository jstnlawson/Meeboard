const initialState = {
    loading: false,
    error: null,
  };
  
  const audioReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPLOAD_AUDIO':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'UPLOAD_AUDIO_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
        };
      case 'UPLOAD_AUDIO_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default audioReducer;
  
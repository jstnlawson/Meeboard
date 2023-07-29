// audioReducer.js

const initialState = {
    uploadStatus: null,
    error: null,
  };
  
  const audioReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'AUDIO_UPLOAD_REQUEST':
        return { ...state, uploadStatus: 'uploading', error: null };
      case 'AUDIO_UPLOAD_SUCCESS':
        return { ...state, uploadStatus: 'success', error: null };
      case 'AUDIO_UPLOAD_FAILURE':
        return { ...state, uploadStatus: 'failure', error: action.payload };
      default:
        return state;
    }
  };
  
  export default audioReducer;
  
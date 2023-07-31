// src/redux/sagas/audioSaga.js
import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';

// Worker Saga: Upload audio to the server
function* uploadAudioWorker(action) {
    try {
        const formData = new FormData();
        formData.append('audiofile', action.payload);
    
        const response = yield axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        const link = response.data;
        // Dispatch success action to update state with the link
        yield put({ type: 'API_UPLOAD_SUCCESS', payload: link });
      } catch (error) {
        // Dispatch failure action to update state with the error
        yield put({ type: 'API_UPLOAD_FAILURE', payload: error.message });
      }
}

// Watcher Saga: Listens for the 'UPLOAD_AUDIO' action
function* audioSaga() {
  yield takeLatest('UPLOAD_AUDIO', uploadAudioWorker);
}

export default audioSaga;

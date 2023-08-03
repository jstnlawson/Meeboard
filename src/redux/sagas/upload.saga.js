
// uploadSagas.js

import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// Saga function to handle the GET request
function* fetchUploads(action) {
   //const userId = action.payload;

  try {
    const userId = action.payload;
    console.log('userId in axios fetch:', userId)
    // Dispatch the 'SET_UPLOADS' action to indicate the start of the request
    yield put({ type: 'SET_UPLOADS' });
    // Make the API call using axios
    const response = yield call(axios.get, `/api/upload/${userId}`);

    // // Dispatch the 'FETCH_USER_UPLOADS_SUCCESS' action with the received data
    // yield put({ type: 'FETCH_USER_UPLOADS_SUCCESS', payload: response.data });
  } catch (error) {
    // Dispatch the 'FETCH_USER_UPLOADS_FAILURE' action with the error message
    console.log('error on fetch samples', error)
  }
}

// Saga watcher function to listen for the GET request action
function* uploadSaga() {
  yield takeLatest('FETCH_UPLOADS', fetchUploads);
}

export default uploadSaga;




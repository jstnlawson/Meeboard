
import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// Saga function to handle the GET request
function* fetchUploads(action) {
    console.log('action in fetchUploads:', action)
    //const userId = action.payload;
    try {
        const userId = action.payload;
        console.log('userId in axios fetch:', userId)
        const response = yield call(axios.get, `/api/upload/${userId}`);
        yield put({ type: 'SET_UPLOADS', payload: response.data });
    } catch (error) {
        console.log('error on fetch samples', error)
    }
}
// function* fetchUploads (action) {
//     id = action.payload
//     try{

//     const samples = yield axios.get('/api/upload');
//     console.log('get all:', samples.data.id);
//     yield put({ type: 'SET_UPLOADS', payload: samples.data.id})
// Saga watcher function to listen for the GET request action
function* uploadSaga() {
    yield takeLatest('FETCH_UPLOADS', fetchUploads);
}

export default uploadSaga;




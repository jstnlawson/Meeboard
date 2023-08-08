import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchSample(action) {
    console.log('action in fetchSample:', action)
    //const userId = action.payload;
    try {
        const userId = action.payload;
        console.log('userId in axios meeboard fetch:', userId)
        const response = yield call(axios.get, `/api/meeboard/${userId}`);
        yield put({ type: 'SET_SAMPLE', payload: response.data });
    } catch (error) {
        console.log('error on fetch meeboard sample', error)
    }
}

function* meeboardSaga() {
    yield takeLatest('FETCH_SAMPLE', fetchSample);
}

export default meeboardSaga;
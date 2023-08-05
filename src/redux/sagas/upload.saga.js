import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

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

function* addUpload(action) {
    try {
        const { formData, audioBlob, sampleName, userId } = action.payload;
        formData.append("sample_name", sampleName);
        formData.append("user_id", userId);
        formData.append("audiofile", audioBlob, "audio.wav");
        const requestOptions = {
            method: 'POST',
            body: formData,
        };
        const response = yield call(fetch, '/api/upload', requestOptions);
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);
        if (!response.ok) {
            console.error('Server returned an error:', response.status, response.statusText);
            return;
        }
        const uploadedData = yield response.json();
        console.log('Uploaded data:', uploadedData);
        yield put({ type: 'ADD_UPLOAD', payload: uploadedData });
    } catch (error) {
        console.error('Error adding upload:', error);
    }
}

function* deleteUpload(action) {
    try {
      yield call(axios.delete, `/api/upload/${action.payload}`);
      console.log('action.payload in axios delete:', action.payload)
      
    //   yield put ({ type: 'FETCH_UPLOADS', payload: action.payload})
    //   console.log('payload in FETCH after axios delete:',action.payload)
    } catch (error) {
      console.error('Error deleting sample:', error);
    }
  }

//   function* editSample(action) {
//     try {
//         console.log("action in editSample:", action);
//         const userId = parseInt(action.payload.userId, 10);
//         console.log("userId in editSample:", userId);
        
//         yield axios.put(`/api/upload/${action.payload.id}`, action.payload);
//         yield put({ type: 'FETCH_UPLOADS', payload: action.payload.userId });
//         console.log("userId in editSaga:", userId)
//     } catch(err) {
//         console.log(err);
//     }
//   }

// function* editSample(action) {
//     try {
//       const { userId, sampleId, ...otherData } = action.payload;
//       console.log("userId in editSample:", userId);
      
  
//       // Form the URL for the PUT request, including the sampleId
//       //const url = `/api/upload/${sampleId}`;
//       const url = `/api/upload/${action.payload.userId}`;
  
//       // Make the PUT request to the server
//       yield axios.put(url, otherData);
  
//       // Dispatch any additional actions if needed, e.g., to refresh the data after the update
//       yield put({ type: 'FETCH_UPLOADS', payload: userId });
//     } catch (error) {
//       console.log(error);
//     }
//   }

function* editSample(action) {
    try {
      
      console.log('Payload in editSample:', action.payload);
      yield axios.put(`/api/upload/${action.payload.id}`, { sample_name: action.payload.sample_name, user_id: action.payload.user_id });

      //yield (axios.put, `/api/upload/${action.payload}`);
      
    } catch (error) {
      console.log(error);
    }
  }
  

function* uploadSaga() {
    yield takeLatest('FETCH_UPLOADS', fetchUploads);
    yield takeLatest('ADD_UPLOAD', addUpload)
    yield takeLatest('DELETE_UPLOAD', deleteUpload);
    yield takeLatest('EDIT_SAMPLE', editSample);
}

export default uploadSaga;




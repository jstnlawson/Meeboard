
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

// function* addUpload(action) {
//     try {
//         const { formData, audioBlob, sampleName, userId } = action.payload;
//         formData.append("sample_name", sampleName);
//         formData.append("user_id", userId);
//         formData.append("audiofile", audioBlob, "audio.wav");
//         yield axios.post('/api/upload', formData);
//         yield put({ type: 'SET_UPLOADS' });
//     } catch (error) {
//         console.log('error in addUploadSaga:', error);
//     }
//}

// function* addUpload(action) {
//     try {
//       const uploadedData = action.payload;
//       // Make the API call to add the upload data to the database using fetch
//       const response = yield call(fetch, '/api/upload', {
//         method: 'POST',
//         body: uploadedData.formData,
//       });
  
//       // Check the response status here and handle it as needed
//       // For example, you can check if the response status is 200 (OK) to consider it a successful upload
  
//       // If you want to fetch the updated list of uploads after adding, you can dispatch the 'FETCH_UPLOADS' action here
//       //yield put({ type: 'FETCH_UPLOADS', payload: uploadedData.userId });
  
//       // You can dispatch additional actions if needed after a successful upload
//       // For example, dispatch a success action, show a success message, etc.
  
//     } catch (error) {
//       // Handle error if needed
//       console.error('Error adding upload:', error);
//     }
//   }

function* addUpload(action) {
    try {
      const { formData, audioBlob, sampleName, userId } = action.payload;
      formData.append("sample_name", sampleName);
      formData.append("user_id", userId);
      formData.append("audiofile", audioBlob, "audio.wav");
  
      // Create the request options for the fetch
      const requestOptions = {
        method: 'POST',
        body: formData,
      };
  
      // Make the API call to add the upload data to the database using fetch
      const response = yield call(fetch, '/api/upload', requestOptions);

      console.log('Response status:', response.status);
    console.log('Response body:', response.body);
  
      if (!response.ok) {
        // Handle server errors here
        console.error('Server returned an error:', response.status, response.statusText);
        return;
      }
  
      // Parse the response body as JSON data
      const uploadedData = yield response.json();

      console.log('Uploaded data:', uploadedData);
  
      // Dispatch the 'ADD_UPLOAD' action with the uploadedData payload
      yield put({ type: 'ADD_UPLOAD', payload: uploadedData });
  
      // You can dispatch additional actions if needed after a successful upload
      // For example, dispatch a success action, show a success message, etc.
  
    } catch (error) {
      // Handle error if needed
      console.error('Error adding upload:', error);
    }
  }
  

function* uploadSaga() {
    yield takeLatest('FETCH_UPLOADS', fetchUploads);
    yield takeLatest('ADD_UPLOAD', addUpload)
}

export default uploadSaga;




import React, {useState} from 'react';

import {useSelector, useDispatch} from 'react-redux';

import AudioRecorder from '../AudioRecorder/AudioRecorder';


function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  //const loading = useSelector((state) => state.audio.loading);
  //const error = useSelector((state) => state.audio.error);

  return (<>
    <div>
    {/* {loading && <p>Uploading...</p>}
    {error && <p>Error: {error}</p>} */} 
    <AudioRecorder />
  </div>
  </>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;

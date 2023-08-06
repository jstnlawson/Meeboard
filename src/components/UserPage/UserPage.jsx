import React, {useState} from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector, useDispatch} from 'react-redux';
import AllTheParts from '../AllTheParts/AllTheParts';
import AudioRecorder from '../AudioRecorder/AudioRecorder';


function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  //const loading = useSelector((state) => state.audio.loading);
  //const error = useSelector((state) => state.audio.error);

  return (<>
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <LogOutButton className="btn" />
    </div>
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

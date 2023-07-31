import React, {useState} from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector, useDispatch} from 'react-redux';
import Meeboard from '../Meeboard/Meeboard';


function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.audio.loading);
  const error = useSelector((state) => state.audio.error);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      dispatch({ type: 'UPLOAD_AUDIO', payload: selectedFile });
    }
  };
  return (<>
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <LogOutButton className="btn" />
    </div>
    <div>
    <h1>Upload Audio</h1>
    <input type="file" onChange={handleFileChange} />
    <button onClick={handleUpload} disabled={loading || !selectedFile}>
      Upload Audio
    </button>
    {loading && <p>Uploading...</p>}
    {error && <p>Error: {error}</p>}
    <Meeboard />
  </div>
  </>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;

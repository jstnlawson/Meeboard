import React, { useState } from "react";
import AudioAnalyser from "react-audio-analyser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from 'react-router-dom';

const AudioRecorder = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioType, setAudioType] = useState("audio/wav");
  const [showForm, setShowForm] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [sampleName, setSampleName] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);

  const userId = useSelector((state) => state.user.id);
  const uploads = useSelector((state) => state.uploadReducer);
  const editReducer = useSelector((state) => state.editReducer);
  const sampleId = useSelector((state) => state.editReducer.id);


  console.log('uploads in audioRecorder:', uploads)
  console.log('userId in AudioRecorder:', userId)
  console.log('editReducer in AudioRecorder:', editReducer)
  console.log('editReducer.id in AudioRecorder:', editReducer?.id)
  console.log('sampleId in AudioRecorder:', sampleId)
  const controlAudio = (status) => {
    setStatus(status);
  };

  const changeScheme = (e) => {
    setAudioType(e.target.value);
  };

  const handleStop = (audioData) => {
    setAudioBlob(audioData.audioBlob);
    setStatus("inactive");
    console.log("succ stop", audioData);
  };

  const uploadAudio = async () => {
    console.log("userId is:", userId);
    if (!audioBlob) return;

    if (!sampleName || !showForm) {
      setShowForm(true);
      return;
    }
    const formData = new FormData();
    formData.append("sample_name", sampleName);
    formData.append("user_id", userId);
    formData.append("audiofile", audioBlob, "audio.wav");
    const response = await fetch("/api/upload", { body: formData, method: "post" });
    setShowForm(false);
    setSampleName("");
    dispatch({ type: 'FETCH_UPLOADS', payload: userId });
  };

  const handleShowSamples = () => {
    setShowSamples((prevShowSamples) => !prevShowSamples); 
  };

  const handleDelete = async (sampleId) => {
    try {
      await dispatch({ type: 'DELETE_UPLOAD', payload: sampleId });
      await new Promise(resolve => setTimeout(resolve, 500));
      await dispatch({ type: 'FETCH_UPLOADS', payload: userId });
    } catch (error) {
      console.error('Error deleting sample:', error);
    }
  }

const handleInputChange = (event) => {
  dispatch({
    type: 'EDIT_ONCHANGE',
    payload: {
      id: sampleId,
      property: 'sample_name',
      value: event.target.value,
    },
  });
};

const handleSaveClick = () => {
  dispatch({
    type: 'EDIT_SAMPLE',
    payload: {
      id: sampleId,
      sample_name: editReducer.sample_name,
      user_id: userId,
    },
  });
};

const handleEditClick = (upload) => {
  dispatch({
    type: 'EDIT_SAMPLE',
    payload: upload,
  });
};

const cancelEdit = () => {
  history.push('/')
}

  const audioProps = {
    audioType,
    status,
    audioSrc,
    timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
    startCallback: (e) => {
      console.log("succ start", e);
    },
    pauseCallback: (e) => {
      console.log("succ pause", e);
    },
    stopCallback: (e) => {
      setAudioSrc(window.URL.createObjectURL(e));
      setAudioBlob(e);
      setStatus("inactive");
      console.log("succ stop", e);
    },
    onRecordCallback: (e) => {
      console.log("recording", e);
    },
    errorCallback: (err) => {
      console.log("error", err);
    },
  };

  useEffect(() => {
    dispatch({ type: 'FETCH_UPLOADS', payload: userId })
    setAudioType("audio/wav");
  }, [dispatch, userId]);

  return (
    <div>
      {showForm && (
        <div className="form-container">
          <input
            type="text"
            value={sampleName}
            onChange={(e) => setSampleName(e.target.value)}
            placeholder="Enter sample name"
          />
          <button onClick={() => setShowForm(false)}>Cancel</button>
          <button onClick={uploadAudio}>Confirm</button>
        </div>
      )}
      <AudioAnalyser {...audioProps} controlAudio={controlAudio}>
        <div className="btn-box">
          <button
            className="btn"
            onClick={() => controlAudio("recording")}
          >
            Start
          </button>
          <button className="btn" onClick={() => controlAudio("paused")}>
            Pause
          </button>
          <button
            className="btn"
            onClick={() => controlAudio("inactive")}
          >
            Stop
          </button>
          <button className="btn" onClick={() => setShowForm(true)}>
            Upload
          </button>
          <button onClick={handleShowSamples}>My Samples</button>


        </div>
      </AudioAnalyser>
      {showSamples && (
        <div>
          {uploads.map((upload) => (
            <ul key={upload.id}>
              {editReducer.id === upload.id ? (
                <>
                  <li>
                    <input
                      type="text"
                      value={editReducer.sample_name}
                      onChange={(e) => handleInputChange(e, upload.id)}
                    />
                  </li>
                  <li>
                    <audio controls src={upload.audio_URL} />
                  </li>
                  <button onClick={handleSaveClick}>Save</button>
                </>
              ) : (
                <>
                  <li>{upload.sample_name}</li>
                  <li>
                    <audio controls src={upload.audio_URL} />
                  </li>
                  <button onClick={() => handleEditClick(upload)}>Edit</button>
                  <button onClick={() => handleDelete(upload.id)}>Delete</button>
                </>
              )}
            </ul>
          ))}
        </div>
      )}
      <p>choose output type</p>
      <select
        name=""
        id=""
        onChange={changeScheme}
        value={audioType}
      >
        <option value="audio/webm">audio/webm（default）</option>
        <option value="audio/wav">audio/wav</option>
        <option value="audio/mp3">audio/mp3</option>
      </select>
    </div>
  );
}


export default AudioRecorder;
import React, { useState } from "react";
import AudioAnalyser from "react-audio-analyser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


const AudioRecorder = () => {
  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioType, setAudioType] = useState("audio/wav");
  const [showForm, setShowForm] = useState(false); // manage form visibility
  const [sampleName, setSampleName] = useState("");
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const uploads = useSelector((state) => state.uploadReducer);

  console.log('uploads in audioRecorder:', uploads)

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

    // If the form is not visible or the sample name is not entered, show the form
    if (!sampleName || !showForm) {
      setShowForm(true);
      return;
    }

    const formData = new FormData();
    formData.append("sample_name", sampleName);
    formData.append("user_id", userId);
    formData.append("audiofile", audioBlob, "audio.wav");

    //const response = await axios.post('/api/upload', formData);
    const response = await fetch("/api/upload", { body: formData, method: "post" });
    // Handle the response as needed

    // Client-side code to fetch user's uploads and display them
async function fetchUserUploads(userId) {
  try {
    // Make a GET request to the server-side endpoint for user's uploads
    const response = await fetch(`/api/upload/${userId}`);
    const data = await response.json();

    // 'data' will contain an array of the user's uploads
    // You can now use this data to display the samples on the front end
    // For example, you can map over the data array and create UI elements for each sample

    // Example:
    data.forEach((upload) => {
      const sampleName = upload.sample_name;
      const audioUrl = upload.audio_URL;
      // Now you can use 'sampleName' and 'audioUrl' to display the sample information
      // and create audio players to play the audio files.
    });

  } catch (error) {
    console.error('Error fetching user uploads', error);
    // Handle error if needed
  }
}


    // Clear the form after successful upload
    setShowForm(false);
    setSampleName("");
  };

  const audioProps = {
    audioType,
    status,
    //audioSrc,
    timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
    startCallback: (e) => {
      console.log("succ start", e);
    },
    pauseCallback: (e) => {
      console.log("succ pause", e);
    },
    stopCallback: (e) => {
      //setAudioSrc(window.URL.createObjectURL(e));
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
      {/* <AudioAnalyser {...audioProps}> */}
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
          <button>
            My Samples
          </button>
        </div>
      </AudioAnalyser>
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
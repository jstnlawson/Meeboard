import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import AudioAnalyser from "react-audio-analyser";
import './AllTheParts.css';

function AllTheParts() {

    //AUDIORECORDER START
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
    //AUDIORECORDER END

    //MEEBOARD START
    const isKeyPressed = useRef(false);
    const handleButtonClick = (keyNumber) => {
        console.log(`Button ${keyNumber} clicked.`);
    };

    const handleKeyDown = (event) => {
        if (!isKeyPressed.current) {
            isKeyPressed.current = true;
            switch (event.key) {
                case 'a':
                    handleButtonClick('key-one');
                    addPressedClass('key-one');
                    break;
                case 'w':
                    handleButtonClick('key-two');
                    addPressedClass('key-two');
                    break;
                case 's':
                    handleButtonClick('key-three');
                    addPressedClass('key-three');
                    break;
                case 'e':
                    handleButtonClick('key-four');
                    addPressedClass('key-four');
                    break;
                case 'd':
                    handleButtonClick('key-five');
                    addPressedClass('key-five');
                    break;
                case 'f':
                    handleButtonClick('key-six');
                    addPressedClass('key-six');
                    break;
                case 't':
                    handleButtonClick('key-seven');
                    addPressedClass('key-seven');
                    break;
                case 'g':
                    handleButtonClick('key-eight');
                    addPressedClass('key-eight');
                    break;
                case 'y':
                    handleButtonClick('key-nine');
                    addPressedClass('key-nine');
                    break;
                case 'h':
                    handleButtonClick('key-ten');
                    addPressedClass('key-ten');
                    break;
                case 'u':
                    handleButtonClick('key-eleven');
                    addPressedClass('key-eleven');
                    break;
                case 'j':
                    handleButtonClick('key-twelve');
                    addPressedClass('key-twelve');
                    break;
                case 'k':
                    handleButtonClick('key-thirteen');
                    addPressedClass('key-thirteen');
                    break;

                default:
                    break;
            }
        }
    };


    const handleKeyUp = () => {
        isKeyPressed.current = false;
        // Clear the .pressed class for all buttons
        const buttons = document.querySelectorAll('.meeboard-container button');
        buttons.forEach((button) => button.classList.remove('pressed'));
    };

    const addPressedClass = (keyNumber) => {
        const buttonElement = document.querySelector(`.${keyNumber}`);
        if (buttonElement) {
            buttonElement.classList.add('pressed');
        }
    };

    useEffect(() => {
        // Add event listeners for keydown and keyup events on the window
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Remove the event listeners when the component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    //MEEBOARD END

    return (
        <>
            
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

            <div className="meeboard-container">

                <button className='record-button'>🔴</button>

                <button className='stop-button' >🟥</button>

                <button className='pause-button'> ⏸</button>

                <button className='play-button'>▶️</button>

                <button className='upload-button'>📂</button>

                <button className="key-one"></button>
                <button className="key-two"></button>
                <button className="key-three"></button>
                <button className="key-four"></button>
                <button className="key-five"></button>
                <button className="key-six"></button>
                <button className="key-seven"></button>
                <button className="key-eight"></button>
                <button className="key-nine"></button>
                <button className="key-ten"></button>
                <button className="key-eleven"></button>
                <button className="key-twelve"></button>
                <button className="key-thirteen"></button>
            </div>

        </>

    )
}



export default AllTheParts;
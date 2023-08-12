import React, { useState, useContext } from "react";
import axios from "axios";
import AudioAnalyser from "react-audio-analyser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import './AudioRecorder.css';

const AudioRecorder = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const distortion = audioContext.createWaveShaper();
  const newDelayNode = audioContext.createDelay();
  const feedback = audioContext.createGain();
  const [isDistorted, setIsDistorted] = useState(false);
  const [isDelayActive, setIsDelayActive] = useState(false);
  const [delayTime, setDelayTime] = useState(0);
  const [delayNode, setDelayNode] = useState(null);

  //const [mediaPlayerVisible, setMediaPlayerVisible] = useState(false);

  const [isUsingUploaded, setIsUsingUploaded] = useState(false);
  //const [showPlayButton, setShowPlayButton] = useState(false);
  const [selectedSampleForPlay, setSelectedSampleForPlay] = useState(null);

  const [selectedSample, setSelectedSample] = useState(null);
  const [uploadedAudioURL, setUploadedAudioURL] = useState(null);

  const dispatch = useDispatch();
  const history = useHistory();

  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioType, setAudioType] = useState("audio/wav");
  const [showForm, setShowForm] = useState(false);

  const [sampleName, setSampleName] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  //const [playbackPosition, setPlaybackPosition] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [audioElements, setAudioElements] = useState([]);

  const [display, setDisplay] = useState('grid');
  const [isClicked, setIsClicked] = useState(false);

  //const [playButtonPress, setPlayButtonPress] = useState(false);



  const userId = useSelector((state) => state.user.id);
  const uploads = useSelector((state) => state.uploadReducer);
  const editReducer = useSelector((state) => state.editReducer);
  const sampleId = useSelector((state) => state.editReducer.id);

  const [showSamples, setShowSamples] = useState(false);



  // console.log('uploads in audioRecorder:', uploads)
  // console.log('userId in AudioRecorder:', userId)
  // console.log('editReducer in AudioRecorder:', editReducer)
  // console.log('editReducer.id in AudioRecorder:', editReducer?.id)
  // console.log('sampleId in AudioRecorder:', sampleId)

  const hideDiv = () => {
    setDisplay('none');
  };

  const showDiv = () => {
    setDisplay('grid');
  };

  const handleLightOn = () => {
    setIsClicked(true);
    controlAudio("recording")
  };

  const handleLightOff = () => {
    setIsClicked(false);
  };


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
    setAudioSrc(URL.createObjectURL(audioData.audioBlob));
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

    const uploadedAudioUrl = await response.text(); // does the response contains the audio URL
    setUploadedAudioURL(uploadedAudioUrl);

    setShowForm(false);
    setSampleName("");
    dispatch({ type: 'FETCH_UPLOADS', payload: userId });
  };

  const handleShowSamples = () => {
    setShowSamples((prevShowSamples) => !prevShowSamples);
    //hideDiv();
    // setShowPlayButton(true);
  };

  //USE SAVED SAMPLE
  //trying to make a play button for uploads
  const handleSampleSelect = (upload) => {
    const uploadSample = upload + "?dl=false";
    console.log('Use Sample clicked!')
    console.log('upload.audio_URL in handleSampleSelect:', upload.audio_URL)
    //console.log('audio_URL in handleSampleSelect:', audio_URL)
    console.log('upload in handleSampleSelect:', upload)
    //setAudioSrc(upload.audio_URL);
    setAudioSrc(uploadSample);
    // showDiv()
    setShowSamples((prevShowSamples) => !prevShowSamples);
  }

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
    
    dispatch({ type: 'FETCH_UPLOADS', payload: userId });
handleShowSamples(true)
  //setShowSamples(false);
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
  //AudioAnalyser Functions
  const audioProps = {
    audioType,
    status,
    audioSrc,
    timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
    onPlayCallback: (e) => {
      console.log("playing", e);
    },
    startCallback: (e) => {
      console.log("succ start", e);
    },
    pauseCallback: (e) => {
      console.log("succ pause", e);
    },
    stopCallback: (e) => {
      handleLightOff()
      setAudioSrc(window.URL.createObjectURL(e));
      setAudioBlob(e);
      setStatus("inactive");
      //setMediaPlayerVisible(false); // Hide media player
      console.log("succ stop", e);
    },
    onRecordCallback: (e) => {
      //handleLightOn()
      console.log("recording", e);

    },
    errorCallback: (err) => {
      console.log("error", err);
    },
  };

  const handlePlay = () => {
    const newAudioElement = new Audio(audioSrc);
    newAudioElement.addEventListener("ended", () => {
      setAudioElements((prevAudioElements) =>
        prevAudioElements.filter((element) => element !== newAudioElement)
      );
    });
    setAudioElements((prevAudioElements) => [...prevAudioElements, newAudioElement]);
    newAudioElement.play();
  };

  const handleSamplePlay = (event, audioURL) => {
    event.preventDefault()
    const audioElement = new Audio(audioURL);
    audioElement.play();
  };
  

  const handleStopAll = () => {
    audioElements.forEach((element) => {
      element.pause();
      element.currentTime = 0;
    });
    setAudioElements([]);
  };
  //pass front end audio through effects
  const handlePitch = (pitchShift) => {
    if (!audioSrc) return;

    fetch(audioSrc)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = pitchShift;

        handleDelayTimeChange(0.5);

        const distortionGainNode = audioContext.createGain();
        distortionGainNode.gain.value = -1;

        if (isDelayActive) {
          source.connect(newDelayNode);
          newDelayNode.connect(audioContext.destination);
        } else {
          source.connect(audioContext.destination);
        }
        if (isDistorted) {
          const distortionNode = audioContext.createWaveShaper();
          distortionNode.curve = makeDistortionCurve(400);
          distortionNode.oversample = "4x";
          source.connect(distortionNode);
          distortionNode.connect(audioContext.destination);
        } else {
          source.connect(audioContext.destination);
        }

        const currentPlaybackPosition = audioPlayer.currentTime;

        source.connect(audioContext.destination);
        source.start(0, currentPlaybackPosition);
      })
      .catch((error) => console.error("Error decoding audio data:", error));

    newDelayNode.delayTime.value = 0.3;
    feedback.gain.value = 0.5;
    newDelayNode.connect(feedback);
    feedback.connect(newDelayNode);

  };
  //pass tuning to keys
  const handleKeys = (key) => {
    const playbackRate = playbackRates[key];
    handlePitch(playbackRate);
  };
  //tune keys
  const playbackRates = {
    key1: 0.2,
    key2: 0.4,
    key3: 0.6,
    key4: 0.8,
    key5: 1.0,
    key6: 1.2,
    key7: 1.4,
    key8: 1.6,
    key9: 1.7,
    key10: 1.8,
    key11: 2.0,
    key12: 2.2,
    key13: 2.4,
  }

  //DISTORTION
  function makeDistortionCurve(amount) {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    // Calculate the distortion curve without normalization
    for (let i = 0; i < n_samples; i++) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }

    // Find the maximum value in the curve array
    const max = Math.max(...curve.map(Math.abs));

    // Normalize the curve to ensure its maximum amplitude is 1
    for (let i = 0; i < n_samples; i++) {
      curve[i] /= max;
    }

    return curve;
  }
  distortion.curve = makeDistortionCurve(400);
  distortion.oversample = "4x";

  //DELAY
  const toggleDelay = () => {
    setIsDelayActive((prevIsDelayActive) => !prevIsDelayActive);
  };

  const handleDelayTimeChange = (time) => {
    setDelayTime(1.0);
  };



  //USEEFFECTS

  //delay effect
  useEffect(() => {
    return () => {
      if (delayNode) {
        delayNode.disconnect();
      }
    };
  }, [delayNode]);
  //handles pause
  useEffect(() => {
    return () => {
      if (audioPlayer) {
        //audioPlayer.removeEventListener("ended", handleAudioEnded);
        audioPlayer.pause();
        //audioPlayer.currentTime = 0;
        //release the audio
        audioPlayer.src = "";
      }
    };
  }, [audioPlayer]);
  //audio player appears on stop
  useEffect(() => {
    const newAudioPlayer = new Audio(audioSrc);

    const handleAudioEnded = () => {
      setIsPlaying(false);
    };

    // Remove  event listener before adding new one
    if (audioPlayer) {
      audioPlayer.removeEventListener("ended", handleAudioEnded);
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      audioPlayer.src = ""; // Release the audio
    }

    newAudioPlayer.addEventListener("ended", handleAudioEnded);

    // Update state with the new player
    setAudioPlayer(newAudioPlayer);

    if (isPlaying) {
      newAudioPlayer.currentTime = 0; // Start from the beginning
      newAudioPlayer.play();
    } else {
      newAudioPlayer.pause();
      newAudioPlayer.currentTime = 0; // Reset to the beginning when paused
    }

    return () => {
      newAudioPlayer.removeEventListener("ended", handleAudioEnded);
      newAudioPlayer.pause();
      newAudioPlayer.currentTime = 0;
      newAudioPlayer.src = "";
    };
  }, [isPlaying, audioSrc]);
  //keydown
  useEffect(() => {
    // Event listener to handle "keydown" 
    const handleKeyDown = (event) => {
      if (event.key === "t") {
        // Check if audioSrc is available 
        if (audioSrc) {
          handlePlay();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Clean up by removing the listener 
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [audioSrc]);
  //fetch on load
  useEffect(() => {
    dispatch({ type: 'FETCH_UPLOADS', payload: userId })
    setAudioType("audio/wav");
  }, [dispatch, userId]);

  return (
    <>
      <div className="user-container" style={{ display: display }}>

        <AudioAnalyser {...audioProps} controlAudio={controlAudio} className="audio-recorder">
        </AudioAnalyser>

        <div className="control-box">
          <button className={`record-button ${isClicked ? 'active' : ''}`} onClick={handleLightOn}></button>

          <span className="record-label">record</span>
          <button className="stop-button" onClick={() => controlAudio("inactive")}></button>
          <span className="stop-label">stop</span>
          <button className="play-button" onClick={handlePlay}></button>
          <span className="play-label">play</span>
          <button className="pause-button" onClick={() => controlAudio("paused")}></button>
          <span className="pause-label">pause</span>
          <button className="upload-button" onClick={() => setShowForm(true)}></button>
          <span className="upload-label">upload</span>

          <div className="form-container">
            {showForm && (<>      <input
              type="text"
              value={sampleName}
              onChange={(e) => setSampleName(e.target.value)}
              placeholder="sample name"

            />
              <button className="form-upload-button" onClick={uploadAudio}><img src="../images/check-icon.png" className="check-icon"/></button>
              <button className="form-cancel-button" onClick={() => setShowForm(false)}><img src="../images/x-icon.png" className="x-icon"/></button></>
            )}
          </div>

        </div>
        <div className="meeboard-container">
          <img src="../images/meeboard-logo.png" className="logo" />
          <label className="delay-toggle">
            <input onClick={toggleDelay} className="toggle-checkbox" type="checkbox" />
            <div className="toggle-switch"></div>
          </label>
          <span className="delay-label">delay</span>
          <label className="distortion-toggle">
            <input onClick={() => setIsDistorted((prevIsDistorted) => !prevIsDistorted)} className="toggle-checkbox" type="checkbox" />
            <div className="toggle-switch"></div>
          </label><span className="distortion-label">distortion</span>
          <button className="key-one" onClick={() => handleKeys("key1")}></button>
          <button className="key-two" onClick={() => handleKeys("key2")}></button>
          <button className="key-three" onClick={() => handleKeys("key3")}></button>
          <button className="key-four" onClick={() => handleKeys("key4")}></button>
          <button className="key-five" onClick={() => handleKeys("key5")}></button>
          <button className="key-six" onClick={() => handleKeys("key6")}></button>
          <button className="key-seven" onClick={() => handleKeys("key7")}></button>
          <button className="key-eight" onClick={() => handleKeys("key8")}></button>
          <button className="key-nine" onClick={() => handleKeys("key9")}></button>
          <button className="key-ten" onClick={() => handleKeys("key10")}></button>
          <button className="key-eleven" onClick={() => handleKeys("key11")}></button>
          <button className="key-twelve" onClick={() => handleKeys("key12")}></button>
          <button className="key-thirteen" onClick={() => handleKeys("key13")}></button>
        </div>

        <button className="sample-folder-button" onClick={handleShowSamples}>🎵</button></div>
      {showSamples && (
        <div className="samples-modal">
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
                    <audio controls src={upload.audio_URL} className="visible-audio" />
                  </li>
                  <button onClick={handleSaveClick}>Save</button>
                </>
              ) : (
                <>
                  <li className="sample-name">
                  <a href="#"onClick={(e) => handleSamplePlay(e, upload.audio_URL)}>
                    <img src="../images/play-icon.png" className="play-icon"/> {upload.sample_name}</a>
                    </li>
              
                  <li>
                    <audio controls src={upload.audio_URL} />
                  </li>
                  <button className="use-saved-button" onClick={() => handleSampleSelect(upload.audio_URL)}>🎹</button>
                  <span className="use-label">use</span>
                  <button className="edit-saved-button" onClick={() => handleEditClick(upload)}><img src="../images/edit-icon.png" className="edit-icon"/></button>
                  <span className="edit-label">edit</span>
                  <button className="delete-saved-button" onClick={() => handleDelete(upload.id)}><img src="../images/delete-icon.png" className="delete-icon"/></button>
                  <span className="delete-label">delete</span>
                </>
              )}
            </ul>
          ))}
        </div>
      )}

    </>

  );
}


export default AudioRecorder;
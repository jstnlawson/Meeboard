import React, { useState } from "react";
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

  const [isUsingUploaded, setIsUsingUploaded] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [selectedSampleForPlay, setSelectedSampleForPlay] = useState(null);

  const [selectedSample, setSelectedSample] = useState(null);
  const [uploadedAudioURL, setUploadedAudioURL] = useState(null);






  const dispatch = useDispatch();
  const history = useHistory();

  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioType, setAudioType] = useState("audio/wav");
  const [showForm, setShowForm] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [sampleName, setSampleName] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [audioElements, setAudioElements] = useState([]);

  //const [playButtonPress, setPlayButtonPress] = useState(false);



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

    const uploadedAudioUrl = await response.text(); // Assuming the response contains the audio URL
    setUploadedAudioURL(uploadedAudioUrl);

    setShowForm(false);
    setSampleName("");
    dispatch({ type: 'FETCH_UPLOADS', payload: userId });
  };

  const handleShowSamples = () => {
    setShowSamples((prevShowSamples) => !prevShowSamples);

    setShowPlayButton(true);
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
    key1: -0.2,
    key2: 0.0,
    key3: 0.2,
    key4: 0.4,
    key5: 0.6,
    key6: 0.8,
    key7: 1.0,
    key8: 1.2,
    key9: 1.4,
    key10: 1.6,
    key11: 1.8,
    key12: 2.0,
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

  //USE SAVED SAMPLE
  //trying to make a play button for uploads
  const handleSampleSelect = (upload) => {
    //setSelectedSample(upload)
    setSelectedSampleForPlay(upload);
    //setAudioSrc(upload.audio_URL);
    setUploadedAudioURL(upload.audio_URL);
  }

  //test function to pass uploaded sample through effects
  const handlePlaySample = async (id) => {
    const pitchShift = 1.5; // Adjust this value to control pitch shift
    console.log("id in handlePlaySample:", id)
    try {
      const { data } = await axios.get(`/api/meeboard/${id}`);
      const audioData = await axios.get(data.audio_URL, {
        responseType: 'arraybuffer',
        withCredentials: true,
      });

      const audioBuffer = await audioContext.decodeAudioData(audioData.data);

      // Create a source node
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Create a gain node to control playback speed (pitch)
      const pitchShiftNode = audioContext.createGain();
      pitchShiftNode.gain.value = pitchShift;

      // Connect the nodes
      source.connect(pitchShiftNode);
      pitchShiftNode.connect(audioContext.destination);

      // Start playing the audio with pitch shift
      source.start(0);
    } catch (error) {
      console.log('error fetching audio file', error);
    }
  };
  // const handlePlaySample = async (audioUrl) => {
  //   const pitchShift = 1.5; // Adjust this value to control pitch shift
  
  //   // Fetch the audio file and decode it
  //   const response = await fetch(audioUrl, { credentials: 'include' });
  //   const audioData = await response.arrayBuffer();
  //   const audioBuffer = await audioContext.decodeAudioData(audioData);
  
  //   // Create a source node
  //   const source = audioContext.createBufferSource();
  //   source.buffer = audioBuffer;
  
  //   // Create a gain node to control playback speed (pitch)
  //   const pitchShiftNode = audioContext.createGain();
  //   pitchShiftNode.gain.value = pitchShift;
  
  //   // Connect the nodes
  //   source.connect(pitchShiftNode);
  //   pitchShiftNode.connect(audioContext.destination);
  
  //   // Start playing the audio with pitch shift
  //   source.start(0);
  // };
  
  // Function to switch between recording and selected sample(not being used yet)
  const [selectedAudioSource, setSelectedAudioSource] = useState(null);
  const switchAudioSource = () => {
    console.log("source switch clicked!")
    setIsUsingUploaded((prevState) => !prevState);
  };

//USEEFFECTS

//handle sample to meeboard(not currently being used)
useEffect(() => {
  if (isUsingUploaded) {
    console.log("useEffect triggered: isUsingUploaded=", isUsingUploaded);
    console.log('audioBlob:', audioBlob);
    console.log('selectedSample:', selectedSample);
    // Logic to set audioSrc to the uploaded audio source
    if (audioBlob) {
      console.log("Setting audio source from audioBlob");
      setAudioSrc(URL.createObjectURL(audioBlob));
    }
  } else if (selectedSample) {
    console.log("Setting audio source from selectedSample");
    // Logic to set audioSrc to the selected sample audio source
    setAudioSrc(selectedSample.audio_URL);
  }
}, [isUsingUploaded, audioBlob, selectedSample]);
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
        <div className="control-box">
          <button
            className="record-button"
            onClick={() => controlAudio("recording")}
          > </button>
          {/* <button className="btn" onClick={() => controlAudio("paused")}>
            Pause
          </button> */}
          <button
            className="stop-button"
            onClick={() => controlAudio("inactive")}
          >
          </button>
          <button className="upload-button" onClick={() => setShowForm(true)}>
          </button><br></br>
          <button className="btn" onClick={handleShowSamples}>My Samples</button>
          {/* <button
            className="btn"
            onClick={handlePlay}>
            Play
          </button>
          <button className="btn" onClick={handlePitch}>
            Play Faster
          </button> */}
          <label className="toggle">
            <input onClick={() => setIsDistorted((prevIsDistorted) => !prevIsDistorted)} className="toggle-checkbox" type="checkbox" />
            <div className="toggle-switch"></div>
            <span className="toggle-label">distortion</span>
          </label>
          <label className="toggle">
            <input onClick={toggleDelay} className="toggle-checkbox" type="checkbox" />
            <div className="toggle-switch"></div>
            <span className="toggle-label">delay</span>
          </label>
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
                  <button onClick={() => handleSampleSelect(upload)}>Use Sample</button>
                  <button onClick={() => handleEditClick(upload)}>Edit</button>
                  <button onClick={() => handleDelete(upload.id)}>Delete</button>
                  {selectedSampleForPlay && selectedSampleForPlay.id === upload.id && (
                    <li>
                      <button onClick={() => handlePlaySample(upload.id)}>pitch change!</button>
                    </li>
                  )}
                </>
              )}
            </ul>
          ))}
        </div>
      )}
      {/* <p>choose output type</p>
      <select
        name=""
        id=""
        onChange={changeScheme}
        value={audioType}
      >
        <option value="audio/webm">audio/webm（default）</option>
        <option value="audio/wav">audio/wav</option>
        <option value="audio/mp3">audio/mp3</option>
      </select> */}
      <div className="meeboard-container">
        {/* {selectedSample && (
          <div>
            <p>Selected Sample: {selectedSample.sample_name}</p>
            <audio controls src={selectedSample.audio_URL} />
          </div>
        )}
        <button onClick={switchAudioSource}>
          {isUsingUploaded ? "Use In-State Recording" : "Use Uploaded File"}
        </button> */}
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

    </div>
  );
}


export default AudioRecorder;
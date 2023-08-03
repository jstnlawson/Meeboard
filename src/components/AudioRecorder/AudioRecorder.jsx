import React, { useState } from "react";
import AudioAnalyser from "react-audio-analyser";
import { useSelector } from "react-redux";
import { useEffect } from "react";


const AudioRecorder = () => {
    const [status, setStatus] = useState("");
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioType, setAudioType] = useState("audio/wav");
    const userId = useSelector((state) => state.user.id);

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
    
        const formData = new FormData();
        formData.append("sample_name", "your_sample_name"); // Replace with your sample name
        formData.append("user_id", userId);
        formData.append("audiofile", audioBlob, "audio.wav");
    
        //const response = await axios.post('/api/upload', formData);
        const response = await fetch("/api/upload", { body: formData, method: "post" });
        // Handle the response as needed
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
            setAudioType("audio/wav");
          }, []);

        return (
            <div>
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
                        <button className="btn" onClick={uploadAudio}>
                            Upload
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
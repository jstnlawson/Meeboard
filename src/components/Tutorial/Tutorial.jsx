import React, { useState, useContext } from "react";
import axios from "axios";
import AudioAnalyser from "react-audio-analyser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import "./Tutorial.css"




const Tutorial = () => {

    const [recordText, setRecordText] = useState(false);
    const [stopText, setStopText] = useState(false);
    const [playText, setPlayText] = useState(false);
    const [pauseText, setPauseText] = useState(false);
    const [uploadText, setUploadText] = useState(false);
    const [distText, setDistText] = useState(false);
    const [delayText, setDelayText] = useState(false);
    const [keyText, setKeyText] = useState(false);
    const [fileText, setFileText] = useState(false);
    const history = useHistory();


    const showRecordText = () => {
        setRecordText(!recordText)
    }
    const showStopText = () => {
        setStopText(!stopText)
    }
    const showPlayText = () => {
        setPlayText(!playText)
    }
    const showPauseText = () => {
        setPauseText(!pauseText)
    }
    const showUploadText = () => {
        setUploadText(!uploadText)
    }
    const showDistText = () => {
        setDistText(!distText)
    }
    const showDelayText = () => {
        setDelayText(!delayText)
    }
    const showKeyText = () => {
        setKeyText(!keyText)
    }
    const showFileText = () => {
        setFileText(!fileText)
    }

    return (
        <>
      <div className="user-container" >
        <button className="start-tutorial" onClick={showRecordText}>START TUTORIAL</button>
        <AudioAnalyser  className="audio-recorder">
        </AudioAnalyser>

        <div className="control-box">

          <button className='record-button' ></button>
          <span className="record-label">record</span>
          <button className="stop-button" ></button>
          <span className="stop-label">stop</span>
          <button className="play-button"></button>
          <span className="play-label">play</span>
          <button className="pause-button"></button>
          <span className="pause-label">pause</span>
          <button className="upload-button"></button>
          <span className="upload-label">upload</span>

          {recordText && (
          <div className="record-tutorial-box">
            <p className="tutorial-text">Starts the recording.<br /> <br />TIP: Make your sound as soon as you hit record to avoid a pause before your sound starts.</p>
            <button className='next-button' onClick={() => {showRecordText(); showStopText();}}>Next</button>
          </div>
            )}
            {stopText && (
          <div className="stop-tutorial-box">
            <p className="tutorial-text">Stop the recording, your sound is now sent to keyboard below and the play button.</p>
            <button className='next-button' onClick={() => {showStopText(); showPlayText();}}>Next</button>
          </div>
            )}
            {playText && (
          <div className="play-tutorial-box">
            <p className="tutorial-text">Playback the recording.</p>
            <button className='next-button' onClick={() => {showPlayText(); showPauseText();}}>Next</button>
          </div>
            )}
            {pauseText && (
          <div className="pause-tutorial-box">
            <p className="tutorial-text">Pause the playback.</p>
            <button className='next-button' onClick={() => {showPauseText(); showUploadText();}}>Next</button>
          </div>
            )}
            {uploadText && (
          <div className="upload-tutorial-box">
            <p className="tutorial-text">Upload sound files you want to keep. You have to be registered and logged in to save files. </p>
            <button className='next-button' onClick={() => {showUploadText(); showKeyText();}}>Next ⬇</button>
          </div>
            )}
        </div>

        

        <div className="meeboard-container">
          <img src="../images/meeboard-logo.png" className="logo" />
          <label className="delay-toggle">
            <input  className="toggle-checkbox" type="checkbox" onClick={showDelayText}/>
            <div className="toggle-switch"></div>
          </label>
          <span className="delay-label">delay</span>
          <label className="distortion-toggle">
            <input className="toggle-checkbox" type="checkbox" onClick={showDistText}/>
            <div className="toggle-switch"></div>
          </label><span className="distortion-label">distortion</span>
          
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
          {keyText && (
          <div className="key-tutorial-box">
            <p className="tutorial-text">Your recording has been pitch shifted to these keys.</p>
            <button className='next-button' onClick={() => {showKeyText(); showFileText();}}>Next ⬇</button>
          </div>
            )}
        </div>
        <button className="sample-folder-button">🎵</button></div>
        {fileText && (
          <div className="file-tutorial-box">
            <p className="tutorial-text">Your saved audio files are in this ⬇ folder.</p>
            <button className='next-button' onClick={() => history.push('/user')}>Go Back to Meeboard!</button>
          </div>
            )}
       </>
    )
}

export default Tutorial

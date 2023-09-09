import React, { useState, useContext } from "react";
import axios from "axios";
import AudioAnalyser from "react-audio-analyser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import "./Tutorial.css"




const Tutorial = () => {

    const [recordText, setRecordText] = useState(false);

    const showRecordText = () => {
        setRecordText(!recordText)
    }


    return (
        <>
      <div className="user-container" >

        <AudioAnalyser  className="audio-recorder">
        </AudioAnalyser>

        <div className="control-box">

          <button className='record-button' onClick={showRecordText}></button>
          <span className="record-label">record</span>
          <button className="stop-button" ></button>
          <span className="stop-label">stop</span>
          <button className="play-button" ></button>
          <span className="play-label">play</span>
          <button className="pause-button" ></button>
          <span className="pause-label">pause</span>
          <button className="upload-button" ></button>
          <span className="upload-label">upload</span>

          {recordText && (
          <div className="tutorial-box">
            <p className="tutorial-text">This starts the recording.<br /> TIP: Make your sound as soon as you hit record to avoid a pause before your sound starts.</p>
            <button onClick={showRecordText}>close</button>
          </div>
            )}


        </div>

        

        <div className="meeboard-container">
          <img src="../images/meeboard-logo.png" className="logo" />
          <label className="delay-toggle">
            <input  className="toggle-checkbox" type="checkbox" />
            <div className="toggle-switch"></div>
          </label>
          <span className="delay-label">delay</span>
          <label className="distortion-toggle">
            <input className="toggle-checkbox" type="checkbox" />
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
        </div>

        <button className="sample-folder-button">🎵</button></div>
      
        

                
        
        
      

    </>
    )
}

export default Tutorial

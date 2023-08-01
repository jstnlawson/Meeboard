import React, { useEffect, useRef, useState } from 'react';
import './AllTheParts.css';

function AllTheParts() {

    //Media Recorder from Web Media API
    const [audioURL, setAudioURL] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const mediaRecorder = useRef(null);
    const audioRef = useRef(null);


    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.current.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            mediaRecorder.current.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setRecordedBlob(blob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const togglePlayback = () => {
        if (!recordedBlob || !audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((error) => {
                // Handle any errors that may occur during playback (e.g., autoplay policies)
                console.error('Error during playback:', error);
            });
        }

        setIsPlaying(!isPlaying);
    };

    const createOrRevokeObjectURL = (blob) => {
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }
        setAudioURL(URL.createObjectURL(blob));
    };

    const playPauseButton = isPlaying ? (
        <button className='pause-button' onClick={togglePlayback} disabled={!recordedBlob}>
            ⏸
        </button>
    ) : (
        <button className='play-button' onClick={togglePlayback} disabled={!recordedBlob}>
            ▶️
        </button>
    );

    useEffect(() => {
        // Check if there is a recordedBlob
        if (recordedBlob) {
            // Call the createOrRevokeObjectURL function to create or revoke the URL
            createOrRevokeObjectURL(recordedBlob);
        }
        // Add recordedBlob as a dependency to the useEffect so that it runs whenever recordedBlob changes
    }, [recordedBlob]);

    const audioElement = audioURL ? (
        <audio ref={audioRef} controls>
            <source src={audioURL} type="audio/wav" className='audio-element' />
            Your browser does not support the audio element.
        </audio>
    ) : null;

    //Meeboard stuff

    const isKeyPressed = useRef(false);
    // Function to handle button clicks
    const handleButtonClick = (keyNumber) => {
        console.log(`Button ${keyNumber} clicked.`);
        // Add your custom actions for each button press here.
    };

    // Function to handle keyboard key presses
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

    return (
        <>
            <div className="meeboard-container">

                {!isRecording ? (
                    <button className='record-button' onClick={startRecording}>🔴</button>
                ) : (
                    <button className='stop-button' onClick={stopRecording}>🟥</button>
                )}
                {playPauseButton}

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
            {audioURL && (
                <audio
                    ref={audioRef}
                    controls
                    className="audio-element"
                    src={audioURL}
                    type="audio/wav"
                >
                    Your browser does not support the audio element.
                </audio>)}
        </>

    )
}



export default AllTheParts;
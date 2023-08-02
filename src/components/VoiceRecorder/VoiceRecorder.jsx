import { useState, useRef } from 'react';

//Media Recorder from Web Media API

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorder = useRef(null);

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

  const playRecording = () => {
    if (recordedBlob) {
      const audio = new Audio(URL.createObjectURL(recordedBlob));
      audio.play();
    }
  };

  return (
    <div>
      {isRecording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}

      <button onClick={playRecording} disabled={!recordedBlob}>
        Play Recording
      </button>

      {/* Display the recorded audio */}
      {recordedBlob && (
        <audio controls>
          <source src={URL.createObjectURL(recordedBlob)} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

//version that sort of worked in the allTheParts file below
// const [audioURL, setAudioURL] = useState('');
//     const [isRecording, setIsRecording] = useState(false);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [recordedBlob, setRecordedBlob] = useState(null);
//     const mediaRecorder = useRef(null);
//     const audioRef = useRef(null);

//     const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

//     const startRecording = async () => {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//           mediaRecorder.current = new MediaRecorder(stream);
//           const chunks = [];
      
//           mediaRecorder.current.ondataavailable = (e) => {
//             chunks.push(e.data);
//           };
      
//           mediaRecorder.current.onstop = () => {
//             const blob = new Blob(chunks, { type: 'audio/wav' });
      
//             if (blob.size <= MAX_AUDIO_SIZE_BYTES) {
//               setRecordedBlob(blob);
//             } else {
//               console.error('Audio size exceeds the maximum limit.');
//             }
//           };
      
//           mediaRecorder.current.start();
//           setIsRecording(true);
//         } catch (err) {
//           console.error('Error accessing microphone:', err);
//         }
//       };

//     const stopRecording = () => {
//         if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
//             mediaRecorder.current.stop();
//             setIsRecording(false);
//             // Before saving to localStorage
//             const blob = new Blob([recordedBlob], { type: 'audio/wav' });
//         localStorage.setItem('recorded_audio', blob);
//             //localStorage.setItem('recorded_audio', JSON.stringify(recordedBlob));

//         }
//     };

//     const togglePlayback = () => {
//         if (!recordedBlob || !audioRef.current) return;

//         if (isPlaying) {
//             audioRef.current.pause();
//         } else {
//             audioRef.current.play().catch((error) => {
//                 // Handle any errors that may occur during playback (e.g., autoplay policies)
//                 console.error('Error during playback:', error);
//             });
//         }

//         setIsPlaying(!isPlaying);
//     };

//     const createOrRevokeObjectURL = (blob) => {
//         if (audioURL) {
//             URL.revokeObjectURL(audioURL);
//         }
//         setAudioURL(URL.createObjectURL(blob));
//     };

//     const playPauseButton = isPlaying ? (
//         <button className='pause-button' onClick={togglePlayback} disabled={!recordedBlob}>
//             ⏸
//         </button>
//     ) : (
//         <button className='play-button' onClick={togglePlayback} disabled={!recordedBlob}>
//             ▶️
//         </button>
//     );

//     useEffect(() => {
//         // Check if there is a recordedBlob
//         if (recordedBlob) {
//             // Call the createOrRevokeObjectURL function to create or revoke the URL
//             createOrRevokeObjectURL(recordedBlob);
//         }
//         // Add recordedBlob as a dependency to the useEffect so that it runs whenever recordedBlob changes
//     }, [recordedBlob]);

//     const audioElement = audioURL ? (
//         <audio ref={audioRef} controls>
//             <source src={audioURL} type="audio/wav" className='audio-element' />
//             Your browser does not support the audio element.
//         </audio>
//     ) : null;

//       const handleDownloadClick = () => {
//         if (!recordedBlob) return;
      
//         try {
//           const downloadLink = document.createElement('a');
//           downloadLink.href = URL.createObjectURL(recordedBlob);
//           downloadLink.download = 'recorded_audio.wav';
//           document.body.appendChild(downloadLink);
//           downloadLink.click();
//           document.body.removeChild(downloadLink);
//         } catch (error) {
//           console.error('Error during download:', error);
//         }
//       };
      

//       useEffect(() => {
//         // Check if there is any previously saved recorded audio data in local storage
//         const savedAudioData = localStorage.getItem('recorded_audio');
//         if (savedAudioData) {
//             const parsedBlob = new Blob([savedAudioData], { type: 'audio/wav' });
//             // Create a temporary URL for the recorded audio data
//             const audioURL = URL.createObjectURL(parsedBlob);
    
//             // Set the audioURL state
//             setAudioURL(audioURL);
//         }
//     }, []);
//in return:
// {audioURL && (
//     <audio
//         ref={audioRef}
//         controls
//         className="audio-element"
//         src={audioURL}
//         type="audio/wav"
//     >
//         Your browser does not support the audio element.
//     </audio>)}

export default VoiceRecorder;

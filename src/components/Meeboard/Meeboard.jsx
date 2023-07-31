import React, { useEffect , useRef} from 'react';
import './Meeboard.css';


function Meeboard() {
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

    // const addPressedClass = (keyNumber) => {
    //     const buttonElement = document.querySelector(`.${keyNumber}`);
    //     if (buttonElement) {
    //         buttonElement.classList.add('pressed');
    //         setTimeout(() => {
    //             buttonElement.classList.remove('pressed');
    //         }, 200); // Remove the .pressed class after the animation duration 
    //     }
    // };

    // useEffect(() => {
    //     // Add event listener for keydown event
    //     window.addEventListener('keydown', handleKeyDown);

    //     // Remove the event listener when the component is unmounted
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, []);

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

export default Meeboard;
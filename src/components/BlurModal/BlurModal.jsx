import React, { useState } from "react";
import './BlurModal.css'

const BlurModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    function toggleModal() {
        setIsModalVisible((prevState) => !prevState);
    }

    return (
        <>
            <div className={`container ${isModalVisible ? 'active' : ''}`} id="blur">
                <div className="content">
                    <p>Where is that modal?</p>
                    <button onClick={toggleModal}>See Modal</button>
                </div>
            </div>
            {isModalVisible && (
                <div className={`modal active`}>
                    <p>Do you see the modal now?</p>
                    <button onClick={toggleModal}>Close</button>
                </div>
            )}
        </>
    )

}

export default BlurModal
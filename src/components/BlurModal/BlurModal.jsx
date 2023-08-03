import React, { useState } from "react";
import './BlurModal.css'

const BlurModal = ({ isModalVisible, toggleModal, children }) => {
    return (
      <>
        {isModalVisible && (
          <>
            <div className="modal-overlay" onClick={toggleModal} />
            <div className="modal">
              <div className="modal-content">
                {children}
              </div>
            </div>
          </>
        )}
      </>
    );
  };

// const BlurModal = () => {
//     const [isModalVisible, setIsModalVisible] = useState(false);

//     function toggleModal() {
//         setIsModalVisible((prevState) => !prevState);
//     }

//     return (
//         <>
//             <div className={`container ${isModalVisible ? 'active' : ''}`} id="blur">
//                 <div className="content">
//                     <p>Where is that modal?</p>
//                     <button onClick={toggleModal}>See Modal</button>
//                 </div>
//             </div>
//             {isModalVisible && (
//                 <div className={`modal active`}>
//                     <p>Do you see the modal now?</p>
                        //  
//                     <button onClick={toggleModal}>Close</button>
//                 </div>
//             )}
//         </>
//     )

// }

export default BlurModal


//HOW TO IMPORT AND USE THIS MODAL:

//also remember to wrap your page in a div with className={blur-container}

// import React, { useState } from "react";
// import BlurModal from "./BlurModal";

// const LoginPage = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   function toggleModal() {
//     setIsModalVisible((prevState) => !prevState);
//   }

//   return (
//     <div>
//       <h1>Login Page</h1>
        //this is the button you add
//       <button onClick={toggleModal}>Show Modal</button>

//       {/* Use the BlurModal with the close button */}
//       <BlurModal isModalVisible={isModalVisible} toggleModal={toggleModal}>
//         <p>Modal content for the Login Page.</p>
//         {/* Add any other login-related content and buttons here */}
//         <button onClick={toggleModal}>Close</button>
//       </BlurModal>
//     </div>
//   );
// };

// export default LoginPage;

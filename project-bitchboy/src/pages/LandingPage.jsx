import "./css/LandingPage.css";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./css/SubscribeButton.css";
import ModelSpin from "./../components/jsx/LandingPage/ModelSpin.jsx";
import ModelScrollAnimated from "./../components/jsx/LandingPage/ModelScrollAnimated.jsx"; // Add this import
import ModelLines from './../components/jsx/LandingPage/ModelLines.jsx';
import ScrollText from './../components/jsx/LandingPage/ScrollText.jsx';
import PopupModal from "./../components/jsx/PopupModal/PopupModal.jsx";

function LandingPage() {

  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate('/interactive-demo');
  };

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div
      style={{
        minHeight: "1200vh",
        minWidth: "100vw",
        background: "#ffffff",
        position: "relative",
      }}
    >
      {" "}
      <ModelScrollAnimated />
      <ModelSpin />
      <ScrollText />
      <ModelLines />
      <div className="orange-bg"></div>
      <div className="orange-bg2"></div>
      <div className="centered-logo-container">
        <div className="logo-reveal-wrapper">
          <img
            src="/images/background/logotextblack.svg"
            alt="Logo"
            className="centered-logo-img"
          />
        </div>
      </div>
      <img
        src="/images/background/arrow.png"
        alt="arrow"
        className="arrow-img"
      />
      <div className="arrow-text">Try it out here!</div>


      <div className="custom-text-block" style={{
        top: '150vh',
        right: '15vw',
      }}>
        Another text block
      </div>

      <img
        src="/images/background/logotextblack.svg"
        alt="Logo"
        className="bottom-logo"
      />

      <img
        src="/images/demogif.gif"
        alt="Demo GIF"
        className="demo-gif"
        style={{ display: "block", margin: "40px auto", maxWidth: "90%", height: "auto" }}
      />

      <div className="bottom-section">
        <button 
          className="demo-button"
          onClick={handleDemoClick}
        >
          Try the online demo here!
        </button>
      </div>


      <button className="cyber-button" onClick={openModal}>
        <span data-text="SIGN UP NOW" class="glitch">
          SIGN UP NOW
        </span>
        <span class="cyberpunk-border"></span>
        <span class="gradient-overlay"></span>
        <span class="scanline"></span>
      </button>

      {showModal && (
        <PopupModal
          setShowModal={setShowModal}
          className="relative w-full max-w-200 mx-auto font-mono z-50"
          onClose={closeModal}
        />
      )}

    </div>
  );
}

export default LandingPage;

import "./css/LandingPage.css";
import React, { useState } from "react";
import "./css/SubscribeButton.css";
import ModelSpin from "./../components/jsx/LandingPage/ModelSpin.jsx";
import ModelScrollAnimated from "./../components/jsx/LandingPage/ModelScrollAnimated.jsx"; // Add this import
import Balatro from "./Balatro/Balatro.jsx";
import PopupModal from "./../components/jsx/PopupModal/PopupModal.jsx";

function LandingPage() {

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div
      style={{
        minHeight: "400vh",
        minWidth: "100vw",
        background: "#ffffff",
        position: "relative",
      }}
    >
      {" "}
      {/* Increased height for scrolling */}
      <ModelScrollAnimated />
      <ModelSpin />
      <div className="orange-bg"></div>
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

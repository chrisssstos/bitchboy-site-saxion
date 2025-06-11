import "./css/LandingPage.css";
import ModelSpin from "./../components/jsx/LandingPage/ModelSpin.jsx";
import ModelScrollAnimated from "./../components/jsx/LandingPage/ModelScrollAnimated.jsx"; // Add this import
import Balatro from "./Balatro/Balatro.jsx";

function LandingPage() {
  return (
    <div style={{ minHeight: "400vh", minWidth: "100vw", background: "#ffffff", position: "relative" }}> {/* Increased height for scrolling */}
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

      <div className="arrow-text">
        Try it out here!
      </div>

      <button className="subscribe-button">Connect with us!</button>

    </div>
  );
}

export default LandingPage;
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

      <button className="subscribe-button">Connect with us!</button>

      {/* Add some content sections to enable scrolling */}
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <h2 style={{ color: "black", fontSize: "3rem" }}>Scroll Down</h2>
      </div>
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "500px" }}>
        <h2 style={{ color: "black", fontSize: "3rem" }}>Keep scrolling...</h2>
      </div>
      <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "right", marginRight: "200px"}}>
        <h2 style={{ color: "black", fontSize: "3rem" }}>Almost there :D</h2>
      </div>

    </div>
  );
}

export default LandingPage;
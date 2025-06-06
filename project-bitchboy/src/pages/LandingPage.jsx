import "./css/LandingPage.css";
import ModelSpin from "./../components/jsx/LandingPage/ModelSpin.jsx";
import ModelScrollAnimated from "./../components/jsx/LandingPage/ModelScrollAnimated.jsx"; // Add this import

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

      <button className="subscribe-button">Sign Up for Updates</button>

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

      <div className="custom-images">
        <img src="public\images\background\bbprime.png" alt="Pic 1" className="custom-img img1" />
        <img src="public\images\background\bb1.png" alt="Pic 2" className="custom-img img2" />
        <img src="public\images\background\bb2.png" alt="Pic 3" className="custom-img img3" />
        <img src="public\images\background\vjsetup.png" alt="Pic 4" className="custom-img img4" />
      </div>
    </div>
  );
}

export default LandingPage;
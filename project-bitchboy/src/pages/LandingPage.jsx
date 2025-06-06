import "./css/LandingPage.css";
import ModelAnimated from "./../components/jsx/LandingPage/ModelAnimated.jsx";
import ModelSpin from "./../components/jsx/LandingPage/ModelSpin.jsx";

function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", background: "#ffffff", position: "relative" }}>
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

      {/* Subscribe button */}
      <button className="subscribe-button">Sign Up for Updates</button>
{/*
      <p className="custom-text1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
      <p className="custom-text2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p> */}

    </div>
  );
}

export default LandingPage;

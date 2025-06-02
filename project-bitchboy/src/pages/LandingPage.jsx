import "./css/LandingPage.css";
import ModelAnimated from "./../components/jsx/LandingPage/ModelAnimated.jsx";

function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", background: "#ffffff", position: "relative" }}>
      <ModelAnimated />
      <div className="centered-logo-container">
        <img
          src="/images/background/logotextblack.svg"
          alt="Logo"
          className="centered-logo-img"
        />
      </div>

      {/* Subscribe button */}
      <button className="subscribe-button">Sign Up for Updates</button>

      {/* Diagonal stripes */}
      <div className="diagonal-stripe" id="stripe1"></div>
      <div className="diagonal-stripe" id="stripe2"></div>
      <div className="diagonal-stripe" id="stripe3"></div>

      {/* Scroll Sections */}
      <section id="section-1" className="scroll-section"></section>
      <section id="section-2" className="scroll-section"></section>
      <section id="section-3" className="scroll-section"></section>
      <section id="section-4" className="scroll-section"></section>
    </div>
  );
}

export default LandingPage;

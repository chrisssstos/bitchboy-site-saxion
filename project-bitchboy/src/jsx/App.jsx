import { Canvas } from "@react-three/fiber";
import "../css/App.css";
import Model from "./Model";


function App() {
  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", background: "#0c0c0c", position: "relative" }}>
      <div className="diagonal-stripe" id="stripe1"></div>
      <div className="diagonal-stripe" id="stripe2"></div>
      <div className="diagonal-stripe" id="stripe3"></div>
      <div className="centered-logo-container">
        <img
          src="/images/logotextwhite.svg"
          alt="Logo"
          className="centered-logo-img"
        />
      </div>
      <button className="subscribe-button">
        Sign Up for Updates
      </button>
    </div>
  );
}


export default App;
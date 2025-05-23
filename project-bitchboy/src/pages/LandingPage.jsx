import {Canvas} from "@react-three/fiber";
import React from "react";

export default function LandingPage() {
  return (
      <div style={{minHeight: "100vh", minWidth: "100vw", background: "#101010", position: "relative"}}>
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
          <Canvas dpr={[1, 2]} shadows camera={{fov: 45}}
                  style={{position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0}}>
              <color attach="background" args={["#0c0c0c"]}/>
          </Canvas>
      </div>
  );
}
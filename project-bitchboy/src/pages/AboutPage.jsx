import React from "react";
import "./css/AboutPage.css";
import Lanyard from "./Lanyard/Lanyard.jsx";
import CardSwap, { Card } from "./CardSwap/CardSwap.jsx";

export default function AboutPage() {
  return (
    <>
      <div className="lanyard-wrapper">
        <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
      </div>
      <span style={{ fontSize: "50px", fontWeight: "bold", color: "yellow" }}>
        ABOUT BLOCKSYSTEM
      </span>
      <div
        className="card-swap-wrapper"
        style={{
          height: "600px",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CardSwap
          cardDistance={60}
          verticalDistance={120}
          delay={5000}
          pauseOnHover={true}
          easing="linear"
        >
          <Card>
            <a class="visual-item wide">
              <div class="overlay">
                <h3>360LAB</h3>
                <p>360° live shows and installations</p>
              </div>
              <img
                src="https://blocksystem.org/assets/images/featured/stm.gif"
                alt="360LAB"
                height="100%"
              />
            </a>
          </Card>
          <Card>
            <a class="visual-item wide">
              <div class="overlay">
                <h3>TV Wall</h3>
                <p>Art Installation for Extrema Outdoor</p>
              </div>
              <img
                src="https://blocksystem.org/assets/images/featured/tvwall.gif"
                alt="TV Wall"
              />
            </a>
          </Card>
          <Card>
            <a class="visual-item wide">
              <div class="overlay">
                <h3>VJing</h3>
                <p>Performed visuals for various EDM Artists and festivals</p>
              </div>
              <img
                src="https://media2.giphy.com/avatars/laserface_/SYQ9tqli7rrE.gif"
                alt="VJ"
              />
            </a>
          </Card>
        </CardSwap>
      </div>
    </>
  );
}

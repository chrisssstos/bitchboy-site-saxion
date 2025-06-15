import React from "react";
import "./css/AboutPage.css";
import Lanyard from "./Lanyard/Lanyard.jsx";
import CardSwap, { Card } from "./CardSwap/CardSwap.jsx";
import lanyardPng from "../../public/images/blocksystem_logo.png";

export default function AboutPage() {
  return (
    <>
      <div className="lanyard-wrapper">
        <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
      </div>
      <span style={{ fontSize: "50px", fontWeight: "bold", color: "black" }}>
        ABOUT US
      </span>
      <div
        style={{
          display: "flex",
          height: "600px",
          width: "100%",
        }}
      >
        {/* left side */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="left-section"
            style={{
              maxWidth: "50%",
              maxHeight: "50%",
              objectFit: "contain",
            }}
          >
            <a href="https://blocksystem.org" target="_blank">
              <img src={lanyardPng} alt="Logo" />
            </a>
            <span className="about-text"
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "black",
                textTransform: "uppercase",
              }}
            >
              Collaborated with 500+ DJs and featured in 100+ shows worldwide
            </span>
          </div>
        </div>

        {/* RIGHT: CardSwap */}
        <div
          className="card-swap-wrapper"
          style={{
            flex: 1,
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
              <a className="visual-item wide">
                <div className="overlay">
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
              <a className="visual-item wide">
                <div className="overlay">
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
              <a className="visual-item wide">
                <div className="overlay">
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
      </div>
    </>
  );
}

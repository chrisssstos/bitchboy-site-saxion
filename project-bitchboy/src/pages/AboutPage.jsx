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
      <span style={{ fontSize: '50px', fontWeight: 'bold', color: 'yellow' }}>ABOUT BLOCKSYSTEM</span>
      <div
        className="card-swap-wrapper"
        style={{ height: "600px", width: "100%", position: "relative", overflow: "hidden" }}
      >
        <CardSwap
          cardDistance={50}
          verticalDistance={90}
          delay={2000}
          pauseOnHover={true}
          easing="linear"
        >
          <Card>
            <h3>Card 1</h3>
            <p>Your content here</p>
          </Card>
          <Card>
            <h3>Card 2</h3>
            <p>Your content here</p>
          </Card>
          <Card>
            <h3>Card 3</h3>
            <p>Your content here</p>
          </Card>
        </CardSwap>
      </div>
    </>
  );
}

import React from "react";
import "./css/AboutPage.css";
import Lanyard from "./Lanyard/Lanyard.jsx";

export default function AboutPage() {
  return (
    <>
      <div className="lanyard-wrapper">
        <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
      </div>
    </>
  );
}

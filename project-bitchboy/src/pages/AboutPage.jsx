import React from "react";
import "./css/AboutPage.css";
import Lanyard from "./Lanyard/Lanyard.jsx";
import Balatro from "./Balatro/Balatro.jsx";

export default function AboutPage() {
  return (
    <>
      <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
    </>
  );
}

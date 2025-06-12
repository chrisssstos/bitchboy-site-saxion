import React from "react";
import "./css/AboutPage.css";
import Lanyard from "./Lanyard/Lanyard.jsx";
import Balatro from "./Balatro/Balatro.jsx";

export default function AboutPage() {
  return (
    <>
      <div className="lanyard-wrapper">
        <div className="absolute inset-0 z-0 w-full h-full">
          <Balatro
            pixelFilter={10000}
            color1="#FFFFFF"
            color2="#FF6B00"
            color3="#FFFFFF"
            lighting={1}
            contrast={1}
            spinAmount={0.1}
            spinSpeed={10}
            mouseInteraction={false}
            //   spinEase={10}
          />
        </div>
        <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
      </div>
    </>
  );
}

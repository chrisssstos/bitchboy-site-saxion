import React from "react";
import TextSection from "../components/jsx/TextSection.jsx";

export default function InteractivePage() {
  return (
      <div className="background-container">
          <div className="diagonal-stripe" id="stripe1"></div>
          <div className="diagonal-stripe" id="stripe2"></div>
          <div className="diagonal-stripe" id="stripe3"></div>
          <div className="container-wrap">
              <TextSection
              title={"Screen"}
              align={"center"}
              >
              </TextSection>
              <TextSection
                  title={"3D Model"}
                  align={"center"}
              >
              </TextSection>
          </div>
      </div>
  );
}
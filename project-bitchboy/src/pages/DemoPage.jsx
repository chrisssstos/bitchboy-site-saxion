import React from "react";
import TextSection from "../components/jsx/TextSection.jsx";
import "./css/DemoPage.css";

export default function DemoPage() {
  return (
      <div className="background-container">
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
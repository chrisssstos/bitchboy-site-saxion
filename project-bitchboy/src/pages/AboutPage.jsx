import React from "react";
import "./css/AboutPage.css";
import TextSection from "../components/jsx/TextSection.jsx";

export default function AboutPage() {
    return (
        <div className="background-container">
            <div className="svg-right-wrapper">
                <img
                    className="svg-right"
                    src={"/images/about-page/right.svg"}
                    alt={""}
                />
            </div>
            <div className="blocksystem-image-wrapper">
                <img
                    className="blocksystem-image"
                    src={"/images/about-page/blocksystem-image.png"}
                    alt={""}
                />
            </div>
            <div className="person-right-image-wrapper">
                <img
                    className="person-image"
                    src={"/images/about-page/person.jpg"}
                    alt={""}
                />
            </div>
            <div className="person-right-text-section">
                <TextSection
                    title={"CHRISTOS 2"}
                    text={"Interaction Tech @ UTwente & Creator @ BLOCK SYSTEM \n Lorem Ipsum"}
                ></TextSection>
            </div>
            <div className="person-left-image-wrapper">
                <img
                    className="person-image"
                    src={"/images/about-page/person.jpg"}
                    alt={""}
                />
            </div>
            <div className="person-left-text-section">
                <TextSection
                    title={"CHRISTOS 1"}
                    text={"Interaction Tech @ UTwente & Creator @ BLOCK SYSTEM \n Lorem Ipsum"}
                ></TextSection>
            </div>
            <div className="main-text-section">
                <TextSection
                    title={"BLOCKSYSTEM © ALL RIGHTS RESERVED"}
                ></TextSection>
            </div>
            <div className="concert-experience-section">
                <TextSection
                    title={"230+"}
                    text={"CONCERT \n EXPERIENCE"}
                ></TextSection>
            </div>
            <div className="amount-of-djs-section">
                <TextSection
                    title={"100+"}
                    text={"WORK WITH \n DJS"}
                ></TextSection>
            </div>
            <div className="svg-circles-wrapper">
                <img
                    className="svg-circles"
                    src={"/images/about-page/circles.svg"}
                    alt={""}
                />
            </div>
            <div className="svg-bottom-wrapper">
                <img
                    className="svg-bottom"
                    src={"/images/about-page/bottom.svg"}
                    alt={""}
                />
            </div>
        </div>
    );
}
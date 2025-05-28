import React from "react";
import TextSection from "../components/jsx/TextSection.jsx";
import ImageCard from "../components/jsx/ImageCard.jsx";
import CardGrid from "../components/jsx/CardGrid.jsx";
import {Text} from "@react-three/drei";
import MiniTextSection from "../components/jsx/MiniTextSection.jsx";
import MiniTextSectionList from "../components/jsx/MiniTextSectionList.jsx";

export default function AboutPage() {
  return (
      <div className="background-container">
          <div className="diagonal-stripe" id="stripe1"></div>
          <div className="diagonal-stripe" id="stripe2"></div>
          <div className="diagonal-stripe" id="stripe3"></div>
          <div className="container-wrap">
              <TextSection
                  title={"Our Mission"}
                  text={"Our mission is to empower visual artists with intuitive, " +
                      "high-performance VJ controllers that seamlessly integrate into" +
                      " any creative setup." +
                      " We blend professional-grade reliability with effortless usability, " +
                      "so performers can focus on their vision—not the technology."}
                  align={"right"}  >
              </TextSection>
              <TextSection
                  title={"Strong points"}
                  text={"Intuitive plug-and-play interface with zero learning curve\n" +
                      "\n" +
                      "High-precision controls for seamless, glitch-free performance\n" +
                      "\n" +
                      "Modular design enabling custom expansions and upgrades\n" +
                      "\n" +
                      "Low-latency response optimized for live shows\n" +
                      "\n" +
                      "Robust, concert-grade build quality for touring environments\n" +
                      "\n" +
                      "Cross-platform compatibility with popular VJ software and hardware"}
                  align={"left"}
              >

              </TextSection>
              <TextSection
                  title={"Our Team"}
                  text={"We are a team of passionate visual artists, engineers, and " +
                      "designers who believe in the power of performance. With backgrounds in " +
                      "music, visual arts, and technology, we bring a unique blend of creativity " +
                      "and technical expertise to every product we create."}
                  align={"right"}
              >
                  <CardGrid cards={[
                      { imgSrc: "/images/worker1.jpg", caption: "Den" },
                      { imgSrc: "/images/worker2.jpg", caption: "Maria" },
                      { imgSrc: "/images/worker3.jpg", caption: "Alex" },
                      { imgSrc: "/images/worker4.jpg", caption: "Sam" },
                  ]}>
                  </CardGrid>
              </TextSection>
              <TextSection
                  title={"FAQ"}
                  text={"Most requested questions from our customers" + "\n" +
                      "If there are not your questions, please contact us via email or social networks."}
                  align={"left"}
              >
                  <MiniTextSectionList
                      items={[
                          {
                              title: "How do I install the controller?",
                              text: "Simply connect the controller to your computer via USB – " +
                                  "no additional drivers are required. It should be recognized" +
                                  " automatically by most VJ software."
                          },
                          {
                              title: "What software is supported?",
                              text: "Our controller works out-of-the-box with leading VJ" +
                                  " applications such as Resolume Arena, TouchDesigner, VDMX, " +
                                  "Modul8, and many others that support MIDI or OSC."
                          },
                          {
                              title: "Can I expand the controller with extra modules?",
                              text: "Yes. Each expansion port accepts optional add-on modules " +
                                  "(faders, knobs, buttons) that can be snapped on magnetically" +
                                  " for custom configurations."
                          },
                          {
                              title: "What is the latency?",
                              text: "Latency is under 3 ms end-to-end, optimized for live" +
                                  " performance. You’ll experience truly real-time response " +
                                  "even with complex visuals."
                          },
                          {
                              title: "Is there a warranty?",
                              text: "All hardware comes with a 2-year limited warranty " +
                                  "covering manufacturing defects. Extended support plans" +
                                  " are also available."
                          },
                          {
                              title: "Do you offer international shipping?",
                              text: "Yes, we ship worldwide. Standard shipping is free " +
                                  "in North America and Europe; for other regions, shipping " +
                                  "fees apply at checkout."
                          },
                          {
                              title: "Can I customize the firmware or mapping?",
                              text: "Absolutely. Our open-source firmware and mapping " +
                                  "tool let you remap any control, create presets, and share " +
                                  "profiles with the community."
                          },
                          {
                              title: "How can I get technical support?",
                              text: "You can reach our support team via " +
                                  "support@bitchboy.com or join our Discord community" +
                                  " for real-time help from both staff and fellow users."
                          }
                      ]}
                  ></MiniTextSectionList>
              </TextSection>
              <TextSection
              title={"Contact Us"}
              text={"Email: bitchboy@gmail.com" + "\n" +
              "Phone: +123456789" + "\n" +
              "Socials: @bitchboy_official" + "\n" +
              "Address: 123 Bitchboy St, VJ City, 12345"}
              align={"right"}>
              </TextSection>
          </div>
      </div>
  );
}
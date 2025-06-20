import React, { useState, useEffect } from 'react';
import { VJProvider } from '../contexts/VJContext';
import MultiLayerVideo from '../components/MultiLayerVideo';
import VJ3DController from '../components/VJ3DController';
import Model from '../components/3DModel';
import VJKeyboardControls from '../components/VJKeyboardControls';
import VJKeyboardHandler from '../components/VJKeyboardHandler';
import VJGame from '../components/VJGame';
import GameModeToggle from '../components/GameModeToggle';
import '../pages/css/InteractivePage.css';
import { Canvas } from '@react-three/fiber';
import { Stage, PresentationControls } from '@react-three/drei';

function InteractivePage() {
  const [showKeyboardControls, setShowKeyboardControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Scroll to a specific point when the page loads
    const scrollToPosition = () => {
      const scrollTarget = window.innerHeight * 0.1; // Scroll 60% of viewport height down
      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth', // Smooth scrolling effect
      });
    };

    scrollToPosition();

    const handleResize = () => {
      if (window.innerWidth <= 964) {
        setIsMobile(true); // Show the message on mobile
      } else {
        setIsMobile(false); // Show the interactive page on desktop
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Call the handler once to set the initial state
    handleResize();

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleKeyboardControls = () => {
    setShowKeyboardControls(!showKeyboardControls);
  };

  if (isMobile) {
    // Render the message for mobile users
    return (
      <div className="mobile-message">
        <p>
          To access the interactive page for the BitchBoy, please open the website on a desktop browser.
        </p>
      </div>
    );
  }

  return (
    <VJProvider>
      <div className="AppContainer">
        {/* Background Multi-Layer Video System - Full Screen */}
        <div className="UIBackground">
          <MultiLayerVideo />
        </div>

        {/* VJ Controller Bridge (invisible but manages 3D ↔ VJ communication) */}
        <VJ3DController />

        <VJKeyboardHandler /> 

        {/* Overlaid 3D Model - Positioned in lower portion */}
        <div className="ModelOverlay">
          <Canvas
            dpr={[1, 2]}
            shadows
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
            gl={{ alpha: true, premultipliedAlpha: false }}
          >
            <PresentationControls
              enabled={false}
              global={false}
            >
              <Stage environment="sunset" intensity={0.0005} shadows={{ type: "contact", opacity: 1, blur: 2 }}>
                <Model scale={0.01} />
              </Stage>
            </PresentationControls>
          </Canvas>
        </div>

        {/* Game Mode Toggle Button */}
        <GameModeToggle />

        {/* Keyboard Controls Toggle Button */}
        <button 
          className={`keyboard-toggle-btn ${showKeyboardControls ? 'active' : ''}`}
          onClick={toggleKeyboardControls}
        >
          {showKeyboardControls ? '→' : '←'}
        </button>

        {/* Keyboard Controls Panel - Slide Animation Container */}
        <div className={`keyboard-controls-container ${showKeyboardControls ? 'visible' : ''}`}>
          {showKeyboardControls && <VJKeyboardControls />}
        </div>

        {/* VJ Game Tutorial System */}
        <VJGame />
      </div>
    </VJProvider>
  );
}

export default InteractivePage;
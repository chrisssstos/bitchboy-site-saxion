import React, { useState } from 'react';
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

  const toggleKeyboardControls = () => {
    setShowKeyboardControls(!showKeyboardControls);
  };

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
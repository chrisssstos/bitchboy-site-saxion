import React from 'react';
import { VJProvider } from '../contexts/VJContext';
import MultiLayerVideo from '../components/MultiLayerVideo';
import VJ3DController from '../components/VJ3DController';
import Model from '../components/3DModel';
import '../pages/css/InteractivePage.css';
import { Canvas } from '@react-three/fiber';
import { Stage, PresentationControls } from '@react-three/drei';
import VJKeyboardControls from '../components/VJKeyboardControls';

function InteractivePage() {
  return (
    <VJProvider>
      <div className="AppContainer">
        {/* Background Multi-Layer Video System - Full Screen */}
        <div className="UIBackground">
          <MultiLayerVideo />
        </div>

        {/* VJ Controller Bridge (invisible but manages 3D ↔ VJ communication) */}
        <VJ3DController />

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
              <Stage environment="sunset" intensity={0.0005} shadows={{type: "contact", opacity: 1, blur: 2}}>
                <Model scale={0.01} />
              </Stage>
            </PresentationControls>
          </Canvas>
        </div>

        <VJKeyboardControls />
      </div>
    </VJProvider>)}

export default InteractivePage;
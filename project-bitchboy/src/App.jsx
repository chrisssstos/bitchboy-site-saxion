import React from 'react';
import { VJProvider } from './contexts/VJContext';
import MultiLayerVideo from './components/MultiLayerVideo';
import VJ3DController from './components/VJ3DController';
import Model from './components/3DModel';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { Stage, PresentationControls } from '@react-three/drei';
import VJKeyboardControls from './components/VJKeyboardControls';

function App() {
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
    </VJProvider>
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import DemoPage from './pages/DemoPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import BlogPage from './pages/BlogPage.jsx';


function App() {
  return (
      <BrowserRouter>
          <div className="content">
              <Routes>
                  <Route path="/" element={<LandingPage/>}/>
                  <Route path="/about" element={<AboutPage/>}/>
                  <Route path="/demo" element={<DemoPage/>}/>
                  <Route path="/pricing" element={<PricingPage/>}/>
                  <Route path="/blog" element={<BlogPage/>}/>
              </Routes>
          </div>
      </BrowserRouter>
  );
}

export default App;

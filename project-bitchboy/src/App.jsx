import React from "react";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import InteractivePage from './pages/InteractivePage.jsx';


function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/interactive" element={<InteractivePage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
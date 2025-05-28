import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import InteractivePage from './pages/InteractivePage.jsx';


function App() {
  return (
      <BrowserRouter>
          <div style={{ paddingTop: "9rem"}}>
              <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/interactive" element={<InteractivePage />} />
              </Routes>
          </div>
      </BrowserRouter>
  );
}

export default App;
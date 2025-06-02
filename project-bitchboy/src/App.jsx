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
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from "./components/jsx/Header.jsx";
import Footer from "./components/jsx/Footer.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <div className="app">
          <Header />
          <App />
          <Footer />
      </div>
  </StrictMode>,
)

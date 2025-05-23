import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './jsx/App.jsx'
import Header from "./jsx/Header.jsx";
import Footer from "./jsx/Footer.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <App />
    <Footer />
  </StrictMode>,
)

import "../css/Header.css";
import { useState, useEffect } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInteractiveVisible, setIsInteractiveVisible] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 968) {
        setIsInteractiveVisible(false); // Hide the "Interactive" link
      } else {
        setIsInteractiveVisible(true); // Show the "Interactive" link
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call the handler once to set the initial state
    handleResize();

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="header">
      <nav className="header-nav">
        <a href="/">
          <div className="title">BLOCKSYSTEM</div>
          <div className="subtitle">STUDIO</div>
        </a>

        <a href="/" className="header-logo">
          <img src="/images/header/logo.svg" alt="Logo Text" />
        </a>

        <button className="hamburger-menu" onClick={toggleMenu}>
          <div className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></div>
          <div className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></div>
          <div className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></div>
        </button>

        <div className={`header-pages ${isMenuOpen ? "open" : ""}`}>
          {isInteractiveVisible && (
            <a href="/interactive-demo" className="page">
              Interactive
            </a>
          )}
          <a href="/pricing" className="page">
            Pricing
          </a>
          <a href="/about" className="page">
            Team
          </a>
          <a href="/blog" className="page">
            Blog
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
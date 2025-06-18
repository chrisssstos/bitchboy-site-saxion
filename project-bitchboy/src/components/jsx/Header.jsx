import "../css/Header.css";
import { useState } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <nav className="header-nav">
        <a href="/">
          <div className="title">
            BLOCKSYSTEM
          </div>
          <div className="subtitle">
            STUDIO
          </div>
        </a>

        <a href="/" className="header-logo">
          <img
            src="/images/header/logo.svg"
            alt="Logo Text"
          />
        </a>

        <button className="hamburger-menu" onClick={toggleMenu}>
          <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
        </button>

        <div className={`header-pages ${isMenuOpen ? 'open' : ''}`}>
          <a href="/interactive-demo" className="page">
            Interactive
          </a>
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
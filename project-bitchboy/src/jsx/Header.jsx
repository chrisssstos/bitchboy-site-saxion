import "../css/Header.css";

function Header() {
  return (
    <header className="header">
      <nav className="header-nav">
        <a href="/" className="header-logo-link">
          <img
            src="/images/logowhite.svg"
            alt="Logo"
            className="header-logo"
          />
        </a>
        <a href="#about" className="header-link">About</a>
        <a href="#contact" className="header-link">Contact</a>
        <a href="#interactive" className="header-link">Interactive</a>
      </nav>
    </header>
  );
}

export default Header;
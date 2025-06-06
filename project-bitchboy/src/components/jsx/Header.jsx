import "../css/Header.css";

function Header() {
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

            <div className="header-logo">
                <img
                    src="/images/header/logo.svg"
                    alt="Logo Text"
                />
            </div>

            <div className="header-pages">
                <a href="/interactive-demo" className="page">
                    Interactive
                </a>
                <a href="/pricing" className="page">
                    Pricing
                </a>
                <a href="/about" className="page">
                    About
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
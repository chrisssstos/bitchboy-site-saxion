import "../css/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <p className="footer-text">
                BLOCK SYSTEM © 2023
            </p>
            <div className="footer-icons">
                <a
                    href="https://www.instagram.com/bitchboy.vj/"
                >
                    <img
                        src={"/images/footer/instagram-black.svg"}
                        alt={"Instagram"}
                    />
                </a>
                <a>
                    <img
                        src={"/images/footer/youtube-black.svg"}
                        alt={"Youtube"}
                    />
                </a>
                <a>
                    <img
                        src={"/images/footer/discord-black.svg"}
                        alt={"Discord"}
                    />
                </a>
                <a>
                    <img
                        src={"/images/footer/facebook-black.svg"}
                        alt={"Facebook"}
                    />
                </a>
            </div>
        </footer>
    );
}

export default Footer;
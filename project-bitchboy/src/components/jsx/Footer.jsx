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
                        src={"/images/logoinstagram.svg"}
                        alt={"Instagram"}
                    />
                </a>
                <a>
                    <img
                        src={"/images/logoyoutube.svg"}
                        alt={"Youtube"}
                    />
                </a>
                <a>
                    <img
                        src={"/images/logodiscord.svg"}
                        alt={"Discord"}
                    />
                </a>
                <a>
                    <img
                        src={"/images/logofacebook.svg"}
                        alt={"Facebook"}
                    />
                </a>
            </div>
        </footer>
    );
}

export default Footer;
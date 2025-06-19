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
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={"/images/footer/instagram-black.svg"}
                        alt={"Instagram"}
                    />
                </a>
                <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={"/images/footer/youtube-black.svg"}
                        alt={"Youtube"}
                    />
                </a>
                <a
                    href="https://discord.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={"/images/footer/discord-black.svg"}
                        alt={"Discord"}
                    />
                </a>
                <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={"/images/footer/facebook-black.svg"}
                        alt={"Facebook"}
                    />
                </a>
            </div>
            <div className="footer-credits">
                <p>Website Credits:</p>
                <a
                    href="https://www.linkedin.com/in/davidmaddin/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    David Maddin
                </a>
                ,{" "}
                <a
                    href="https://www.linkedin.com/in/bao-anh-nguyen-2b931335a/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Anh Nguyen
                </a>
                ,{" "}
                <a
                    href="https://github.com/nguyentuannguyenan"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    An Nguyen
                </a>
                ,{" "}
                <a
                    href="https://www.linkedin.com/in/syandana-suntana-4bb58727b/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Syandana Suntana
                </a>
                ,{" "}
                <a
                    href="https://www.linkedin.com/in/amir-bayat-97775828b/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Emhyr Bayat
                </a>
                , and{" "}
                <a
                    href="https://www.linkedin.com/in/mykyta-golubov/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Mykyta Golubov
                </a>
                .
            </div>
        </footer>
    );
}

export default Footer;
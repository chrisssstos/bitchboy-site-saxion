import "../../css/AboutPage/ImageCard.css";

function ImageCard({imgSrc, caption}) {
    return (
        <div className="image-card">
            <img src={imgSrc} alt={caption} className="image-card-img"/>
            <div>{caption}</div>
            <div className="image-card-overlay">
                <span className="image-card-caption">{caption}</span>
            </div>
        </div>
    );
}

export default ImageCard;
import ImageCard from "./ImageCard";
import "../css/CardGrid.css";



function CardGrid({ cards }) {
    return (
        <div className="card-grid">
            {cards.map(card => (
                <ImageCard
                    imgSrc={card.imgSrc}
                    caption={card.caption}
                />
            ))}
        </div>
    );
}

export default CardGrid;
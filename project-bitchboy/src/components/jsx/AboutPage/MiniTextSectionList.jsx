import "../../css/AboutPage/MiniTextSectionList.css";
import MiniTextSection from "./MiniTextSection.jsx";

function MiniTextSectionList({items}){
    return (
        <section className="mini-text-section-list">
            {items.map(item => (
                <MiniTextSection
                title={item.title}
                text={item.text}
                >
                </MiniTextSection>
            ))}
        </section>
    );
}

export default MiniTextSectionList;
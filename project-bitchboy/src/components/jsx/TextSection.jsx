import "../css/TextSection.css";

function TextSection({ title, text, align, children }) {
    const cls = `text-section text-section-${align}`;
    return(
        <section className={cls}>
            <h2 className="text-section-title">{title}</h2>
            <p className="text-section-text">{text}</p>
            {children}
        </section>
    );
}

export default TextSection;
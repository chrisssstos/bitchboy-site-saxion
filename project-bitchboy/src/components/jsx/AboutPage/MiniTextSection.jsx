import "../../css/AboutPage/MiniTextSection.css";
import React, { useState } from "react";

function MiniTextSection({ title, text }) {
    const [open, setOpen] = useState(false);
    return(
        <div
            className="mini-text-section"
            onClick={() => setOpen(!open)}
        >
            <div className="mini-text-section-title">{title}</div>
            { open && <div className="mini-text-section-content">{text}</div>}
        </div>
    );
}

export default MiniTextSection;
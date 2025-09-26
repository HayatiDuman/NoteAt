import React, { useRef, useState } from "react";
import "./Toolbar.css";

function Toolbar({ styles, onStyleChange, editingNoteId }) {
  const COLORS = [
    "#1C1C1C",
    "#FDFDFD",
    "#E63946",
    "#2A9D8F",
    "#457B9D",
    "#F4A261",
    "#E76F51",
    "#9D4EDD",
    "#6C757D",
    "#3AAFA9",
    "#8D6E63",
    "#F67280",
    "#F2C94C",
    "#00B4D8",
    "#708090",
    "#F5DEB3",
  ];

  const [isTextPaletteOpen, setIsTextPaletteOpen] = useState(false);
  const [isBgPaletteOpen, setIsBgPaletteOpen] = useState(false);

  const textPaletteRef = useRef(null);
  const bgPaletteRef = useRef(null);

  const toggleStyle = (property) => {
    onStyleChange({ ...styles, [property]: !styles[property] });
  };

  const updateStyle = (property, value) => {
    onStyleChange({ ...styles, [property]: value });
  };

  const applyColor = (property, value) => {
    onStyleChange({ ...styles, [property]: value });

    if (property === "color") setIsTextPaletteOpen(false);
    if (property === "backgroundColor") setIsBgPaletteOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isTextPaletteOpen &&
        textPaletteRef.current &&
        !textPaletteRef.current.contains(e.target)
      ) {
        setIsTextPaletteOpen(false);
      }

      if (
        isBgPaletteOpen &&
        bgPaletteRef.current &&
        !bgPaletteRef.current.contains(e.target)
      ) {
        setIsBgPaletteOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTextPaletteOpen, isBgPaletteOpen]);

  return (
    <div
      className="toolbar"
      style={{
        display: editingNoteId != null ? "" : "none",
      }}
    >
      {/* Bold & Italic */}
      <div className="type-buttons toolbar-section">
        <button
          className={`bold-button ${styles.bold ? "active-button" : ""}`}
          onClick={() => toggleStyle("bold")}
        >
          B
        </button>

        <button
          className={`italic-button ${styles.italic ? "active-button" : ""}`}
          onClick={() => toggleStyle("italic")}
        >
          I
        </button>
      </div>

      {/* Text Color */}
      <div className="color-palette toolbar-section">
        <button
          className="current-color-button"
          style={{
            color: styles.color,
            fontWeight: styles.bold ? "bold" : "normal",
            fontSize: "16px",
          }}
        >
          A
        </button>
        <input
          type="checkbox"
          id="palette-toggle-color"
          checked={isTextPaletteOpen}
          onChange={(e) => setIsTextPaletteOpen(e.target.checked)}
        />
        <label
          htmlFor="palette-toggle-color"
          className="open-palette-button"
        ></label>

        {isTextPaletteOpen && (
          <div className="palette" ref={textPaletteRef}>
            {COLORS.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                className="color-palette-item"
                onClick={() => applyColor("color", color)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Background Color */}
      <div className="color-palette toolbar-section">
        <button
          className="current-color-button"
          style={{ backgroundColor: styles.backgroundColor }}
        ></button>
        <input
          type="checkbox"
          id="palette-toggle-bgcolor"
          checked={isBgPaletteOpen}
          onChange={(e) => setIsBgPaletteOpen(e.target.checked)}
        />
        <label
          htmlFor="palette-toggle-bgcolor"
          className="open-palette-button"
        ></label>

        {isBgPaletteOpen && (
          <div className="palette" ref={bgPaletteRef}>
            {COLORS.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                className="color-palette-item"
                onClick={() => applyColor("backgroundColor", color)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Font Family */}
      <div className="toolbar-section">
        <select
          className="font-family-slct"
          value={styles.fontFamily}
          onChange={(e) => updateStyle("fontFamily", e.target.value)}
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Comic Sans MS', cursive, sans-serif">
            Comic Sans MS
          </option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
        </select>
      </div>

      {/* Font Size */}
      <div className="toolbar-section">
        <select
          className="font-size-slct"
          value={styles.fontSize}
          onChange={(e) => updateStyle("fontSize", e.target.value)}
        >
          {[
            "8px",
            "10px",
            "12px",
            "14px",
            "16px",
            "18px",
            "20px",
            "24px",
            "28px",
            "32px",
            "36px",
            "40px",
            "48px",
          ].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Toolbar;

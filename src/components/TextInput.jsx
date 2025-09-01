import { useEffect, useRef, useState } from "react";
import "./TextInput.css";

function TextInput({
  placeholder,
  content,
  styles,
  isEditing,
  isChecked = false,
  onContentChange,
}) {
  const { bold, italic, color, backgroundColor, fontSize, fontFamily } =
    styles || {};
  const ref = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // text değiştiğinde editable div içeriğini güncelle
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.innerHTML = content || "";
      setIsEmpty(!content || content.trim() === "");
    }
  }, [content]);

  const handleInput = () => {
    const value = ref.current.innerHTML;
    const textOfValue = ref.current.innerText;
    setIsEmpty(textOfValue.trim() === "");
    onContentChange(value);
  };

  return (
    <div className="textinput-wrapper" style={{ position: "relative" }}>
      {isEmpty && placeholder && (
        <div className="textinput-placeholder">{placeholder}</div>
      )}
      <div
        ref={ref}
        className={`editable-div ${isChecked ? "checked-editable-div" : ""}`}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onInput={handleInput}
        style={{
          fontWeight: bold ? "bold" : "normal",
          fontStyle: italic ? "italic" : "normal",
          color: color,
          backgroundColor: backgroundColor,
          fontSize: fontSize,
          fontFamily: fontFamily,
        }}
        spellCheck={false}
        autoCorrect="off"
        autoComplete="off"
        autoCapitalize="off"
      />
    </div>
  );
}

export default TextInput;

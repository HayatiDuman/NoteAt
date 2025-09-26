import React, { useRef, useState } from "react";

function MiniMap({ notes, canvasWidth, canvasHeight }) {
  const [miniMapSize, setMiniMapSize] = useState(50);
  const scaleX = miniMapSize / canvasWidth;
  const scaleY = miniMapSize / canvasHeight;
  const isOpen = useRef(false);

  const toggleMapSize = () => {
    isOpen.current = !isOpen.current;
    if (isOpen.current) {
      setMiniMapSize(200);
    } else {
      setMiniMapSize(50);
    }
  };

  return (
    <div
      onClick={toggleMapSize}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: miniMapSize,
        height: miniMapSize,
        border: "1px solid #ccc",
        backgroundColor: "#1C1C1C",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            position: "absolute",
            left: note.position.x * scaleX,
            top: note.position.y * scaleY,
            width: note.size.width * scaleX,
            height: note.size.height * scaleY,
            backgroundColor: note.data.styles.backgroundColor || "#2A9D8F",
            opacity: 0.7,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

export default MiniMap;

import React, { useRef } from "react";
import "./Note.css";
import noteTypes from "./constants/noteTypes";
import useDragging from "../hooks/useDragging";
import { useClickOutside } from "../hooks/useClickOutside";
import useResizing from "../hooks/useResizing";

function Note({
  note,
  isEditing,
  isLocked,
  onEditStart,
  onEditEnd,
  onDelete,
  onDataChange,
  onPositionChange,
  onSizeChange,
  containerRef,
  toolbarRef,
  onClick,
  zIndex,
}) {
  const { type, position, size, data } = note;

  const ContentComponent = noteTypes[type]?.component || null;
  const placeholder = noteTypes[type]?.placeholder || "bu ne?";

  const noteRef = useRef(null);
  const { handleMouseDown } = useDragging({
    ref: noteRef,
    containerRef,
    onPositionChange,
    isEditing,
  });

  const { isResizing, handleResizing } = useResizing({
    ref: noteRef,
    containerRef,
    onSizeChange,
  });

  useClickOutside({
    refs: [noteRef, toolbarRef],
    controllerList: [isEditing],
    onOutsideClick: onEditEnd,
  });

  //-----Entering Editting Mode Part-----//
  const handleDoubleClick = () => {
    if (!isEditing) {
      window.getSelection().removeAllRanges();
      onEditStart();
    }
  };

  return (
    <div
      className={`note ${isEditing ? "editing-border" : ""} `}
      ref={noteRef}
      data-id={note.id} // <-- Burayı ekle
      onMouseDown={(e) => {
        onClick?.();
        handleMouseDown(e);
      }}
      onDoubleClick={handleDoubleClick}
      style={{
        pointerEvents: isLocked ? "none" : "auto",
        userSelect: isLocked ? "none" : "",
        cursor: isResizing ? "default" : "se-resize",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: zIndex,
      }}
    >
      <ContentComponent
        placeholder={placeholder}
        data={data}
        isEditing={isEditing}
        onDataChange={onDataChange}
      />
      <button className="delete-button" onClick={onDelete}>
        Sil
      </button>
      <div className="resize-handle-area" onMouseDown={handleResizing}></div>
    </div>
  );
}

export default Note;

import React, { useRef } from "react";
import "./Note.css";
import noteTypes from "./constants/noteTypes";
import useDragging from "../hooks/useDragging";
//import { document } from "postcss";

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
}) {
  const { type, position, size, data } = note;

  const ContentComponent = noteTypes[type]?.component || null;
  const placeholder = noteTypes[type]?.placeholder || "bu ne?";

  const isResizing = useRef(false);
  const { noteRef, handleMouseDown } = useDragging({
    containerRef,
    onPositionChange,
    isEditing,
  });

  //-----Entering Editting Mode Part-----//
  const handleDoubleClick = () => {
    if (!isEditing) {
      window.getSelection().removeAllRanges();
      onEditStart();
    }
  };

  //-----Exciting Editting Mode Part-----//
  const handleClickOutside = React.useCallback(
    (e) => {
      if (
        isEditing &&
        noteRef.current &&
        !noteRef.current.contains(e.target) &&
        !toolbarRef.current.contains(e.target)
      ) {
        window.getSelection().removeAllRanges();
        onEditEnd();
      }
    },
    [noteRef, toolbarRef, isEditing, onEditEnd]
  );

  //-----Resizing Controlling Part-----//
  const handleResizing = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const onResize = (e) => {
      isResizing.current = true;
      const containerRect = containerRef.current.getBoundingClientRect();
      const noteRect = noteRef.current.getBoundingClientRect();

      const maxWidth = containerRect.right - noteRect.left;
      const maxHeight = containerRect.bottom - noteRect.top;

      const newWidth = Math.min(
        Math.max(e.clientX - noteRect.left, 50),
        maxWidth
      );
      const newHeight = Math.min(
        Math.max(e.clientY - noteRect.top, 50),
        maxHeight
      );

      onSizeChange({ width: newWidth, height: newHeight });
    };

    const onResizeEnd = () => {
      isResizing.current = false;
      document.removeEventListener("pointermove", onResize);
      document.removeEventListener("pointerup", onResizeEnd);
    };

    document.addEventListener("pointermove", onResize);
    document.addEventListener("pointerup", onResizeEnd);
  };

  React.useEffect(() => {
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      className={`note ${isEditing ? "editing-border" : ""} `}
      ref={noteRef}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={onClick}
      style={{
        pointerEvents: isLocked ? "none" : "auto",
        userSelect: isLocked ? "none" : "",
        cursor: isResizing ? "default" : "se-resize",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
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

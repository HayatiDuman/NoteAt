import React, { useRef } from "react";
import "./Note.css";
import noteTypes from "./NoteTypes";
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

  const noteRef = useRef(null);
  const isResizing = useRef(false);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  //-----Dragging and Resizing Management Part-----//
  const handleMouseDown = (e) => {
    if (e.button !== 0 || isEditing) return; //sol tık sorgulama

    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      if (isDragging) isDragging.current = false;
      return;
    }

    isDragging.current = true;
    const rect = noteRef.current.getBoundingClientRect();

    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.addEventListener("pointermove", handleMouseMove);
    document.addEventListener("pointerup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    //document.body.style.userSelect = "none";
    window.getSelection().removeAllRanges();

    const containerRect = containerRef.current.getBoundingClientRect();
    const noteRect = noteRef.current.getBoundingClientRect();

    const newX = Math.min(
      Math.max(e.clientX - containerRect.left - offset.current.x, 0),
      containerRect.width - noteRect.width
    );

    const newY = Math.min(
      Math.max(e.clientY - containerRect.top - offset.current.y, 0),
      containerRect.height - noteRect.height
    );

    onPositionChange({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    isDragging.current = false;

    document.body.style.userSelect = "";

    document.removeEventListener("pointermove", handleMouseMove);
    document.removeEventListener("pointerup", handleMouseUp);
  };

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

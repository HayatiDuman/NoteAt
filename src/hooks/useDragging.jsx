import React, { useRef } from "react";

function useDragging({ containerRef, onPositionChange, isEditing }) {
  const noteRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

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

  return { noteRef, handleMouseDown };
}

export default useDragging;

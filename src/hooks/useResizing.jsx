import React, { useRef } from "react";

function useResizing({ ref, containerRef, onSizeChange }) {
  const isResizing = useRef(false);
  const handleResizing = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const onResize = (e) => {
      isResizing.current = true;
      const containerRect = containerRef.current.getBoundingClientRect();
      const noteRect = ref.current.getBoundingClientRect();

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

  return { isResizing, handleResizing };
}

export default useResizing;

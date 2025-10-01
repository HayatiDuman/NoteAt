import React, { useRef } from "react";

export function useClickOutside({ refs, controllerList, onOutsideClick }) {
  const controllerValue = useRef(true);
  const handleClickOutside = React.useCallback(
    (e) => {
      controllerValue.current = true;
      controllerList.forEach((controller) =>
        controller ? null : (controllerValue.current = false)
      );

      if (!controllerValue.current) return;

      const clickedInside = refs.some(
        (ref) => ref.current && ref.current.contains(e.target)
      );

      if (!clickedInside) {
        window.getSelection().removeAllRanges();
        onOutsideClick();
      }
    },
    [refs, controllerList, onOutsideClick]
  );

  React.useEffect(() => {
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [handleClickOutside]);
}

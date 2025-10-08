// ContextMenu.jsx
import { useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import "./ContextMenu.css";

export default function ContextMenu({ position, isOpen, onClose, onDelete }) {
  const menuRef = useRef(null);

  useClickOutside({
    refs: [menuRef],
    controllerList: [isOpen],
    onOutsideClick: onClose,
  });

  if (!isOpen) return null;

  return (
    <ul
      ref={menuRef}
      className="context-menu"
      style={{ left: position?.x || 0, top: position?.y || 0 }}
    >
      <li
        onClick={() => {
          onDelete?.();
          onClose?.();
        }}
      >
        Notu Sil
      </li>
    </ul>
  );
}

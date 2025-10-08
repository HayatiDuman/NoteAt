import { useRef, useState } from "react";
import "./App.css";
import Note from "./components/Note.jsx";
import Toolbar from "./components/ui/Toolbar.jsx";
import MiniMap from "./components/MiniMap.jsx";
import { useNotes } from "./hooks/useNotes.js";
import ContextMenu from "./components/ui/ContextMenu.jsx";

function App() {
  const {
    notes,
    setNotes,
    notesZIndex,
    bringNoteToFront,
    addNote,
    deleteNote,
    updateNotePosition,
    updateNoteSize,
    updateStyle,
    selectedNoteId,
    setSelectedNoteId,
    editingNoteId,
    setEditingNoteId,
    setSelectedNoteType,
    isLocked,
    setIsLocked,
  } = useNotes();
  //-----Reference Management Part-----//
  const containerRef = useRef(null);
  const toolbarRef = useRef(null);
  const isPanning = useRef(false);
  const lastPosOfTarget = useRef({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    targetID: null,
  });

  //-----Context Menu Management-----//
  const handleContextMenu = (e) => {
    const target = e.target.closest(".note");

    if (target) {
      e.preventDefault();
      const id = target.dataset.id;
      setContextMenu({
        isOpen: true,
        position: { x: e.pageX, y: e.pageY },
        targetID: id,
      });
    } else {
      // Boş alanda normal tarayıcı menu açık kalsın
      setContextMenu({ ...contextMenu, isOpen: false, targetID: null });
    }
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  // Tahtayı sürükleme (pan)
  const handleMouseDown = (e) => {
    if (e.target !== containerRef.current) return;

    containerRef.current.classList.add("grabbing");

    isPanning.current = true;
    lastPosOfTarget.current = { x: e.clientX, y: e.clientY };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e) => {
    if (!isPanning.current) return;

    const dx = e.clientX - lastPosOfTarget.current.x;
    const dy = e.clientY - lastPosOfTarget.current.y;

    lastPosOfTarget.current = { x: e.clientX, y: e.clientY };

    window.scrollBy(-dx, -dy);
  };
  const handleMouseUp = () => {
    isPanning.current = false;
    containerRef.current.classList.remove("grabbing");
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const findSelectedNote = () =>
    notes.find((note) => note.id === selectedNoteId) || null;

  const selectedNote = findSelectedNote();

  return (
    <div
      className={`container ${isLocked ? "locked" : ""}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      <div className="context-menu-dnm">
        <ContextMenu
          position={contextMenu.position}
          isOpen={contextMenu.isOpen}
          onClose={closeContextMenu}
          onDelete={() => deleteNote(contextMenu.targetID)}
        />
      </div>
      <div ref={toolbarRef}>
        <Toolbar
          selectedNoteId={selectedNoteId}
          styles={selectedNote ? selectedNote.data.styles : {}}
          onStyleChange={updateStyle}
          editingNoteId={editingNoteId}
        />
      </div>
      <div className="menu">
        <button className="menu-btn add-btn" onClick={addNote} title="Yeni Not">
          <span className="plus" aria-hidden="true"></span>
          <span className="sr-only">Ekle</span>
        </button>

        <div className="select-wrapper">
          <select
            name="noteTypesSelecter"
            className="note-select"
            onChange={(e) => setSelectedNoteType(e.target.value)}
          >
            <option value="textNote">Boş Not</option>
            <option value="todoNote">Yapılacaklar</option>
          </select>
        </div>

        <button
          className="menu-btn lock-btn"
          onClick={() => {
            setIsLocked(!isLocked);
            window.getSelection().removeAllRanges();
          }}
          title={isLocked ? "Kilidi Aç" : "Notları Kilitle"}
        >
          {isLocked ? (
            <img className="btn-img" src="src\assets\lock.png" />
          ) : (
            <img className="btn-img" src="src\assets\unlock.png" />
          )}
        </button>
        <button className="menu-btn" onClick={() => {}} title={""}></button>
        <button className="menu-btn" onClick={() => {}} title={""}></button>
        <button className="menu-btn" onClick={() => {}} title={""}></button>
      </div>
      <MiniMap notes={notes} canvasWidth={2000} canvasHeight={2000} />

      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          isEditing={editingNoteId === note.id}
          isLocked={isLocked}
          onEditStart={() => setEditingNoteId(note.id)}
          onEditEnd={() => setEditingNoteId(null)}
          onClick={() => {
            setSelectedNoteId(note.id);
            bringNoteToFront(note.id);
          }}
          onDelete={() => deleteNote(note.id)}
          onDataChange={(newData) => {
            setNotes((prev) =>
              prev.map((n) => (n.id === note.id ? { ...n, data: newData } : n))
            );
          }}
          onPositionChange={(newPos) => updateNotePosition(note.id, newPos)}
          onSizeChange={(newSize) => updateNoteSize(note.id, newSize)}
          containerRef={containerRef}
          toolbarRef={toolbarRef}
          zIndex={notesZIndex[note.id] || 1} // default 1
        />
      ))}
    </div>
  );
}

export default App;

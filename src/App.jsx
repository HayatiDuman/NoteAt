import { useRef, useState } from "react";
import "./App.css";
import Note from "./components/Note.jsx";
import Toolbar from "./components/Toolbar.jsx";

function App() {
  //-----State Management Part-----//
  const [notes, setNotes] = useState([]);
  const [selectedNoteType, setSelectedNoteType] = useState("textNote");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  //-----Reference Management Part-----//
  const containerRef = useRef(null);
  const toolbarRef = useRef(null);
  const isPanning = useRef(false);
  const lastPosOfTarget = useRef({ x: 0, y: 0 });

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

  //-----Data Management by Note Type Part-----//
  const getDefaultData = (type) => {
    switch (type) {
      case "textNote":
        return {
          content: "",
          styles: {
            bold: false,
            italic: false,
            color: "#000000",
            backgroundColor: "#ffffff",
            fontSize: "16px",
            fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
          },
        };
      case "todoNote":
        return {
          todoItems: [
            {
              id: crypto.randomUUID(),
              isChecked: false,
              content: "",
              styles: {
                bold: false,
                italic: false,
                color: "#000000",
                backgroundColor: "#ffffff",
                fontSize: "16px",
                fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
              },
            },
          ],
        };
    }
  };

  //-----Notes List Management Part-----//
  const addNote = () => {
    const newNote = {
      id: Date.now(),
      type: selectedNoteType,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
      data: getDefaultData(selectedNoteType),
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id != id));
  };

  //-----Posisiton and Size Management Part-----//
  const updateNotePosition = (id, newPosition) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, position: newPosition } : note
      )
    );
  };
  const updateNoteSize = (id, newSize) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, size: newSize } : note
      )
    );
  };

  const findSelectedNote = () =>
    notes.find((note) => note.id === selectedNoteId) || null;

  const selectedNote = findSelectedNote();

  const handleStyleChange = (newStyles) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === selectedNoteId
          ? { ...note, data: { ...note.data, styles: newStyles } }
          : note
      )
    );
  };

  return (
    <div
      className={`container ${isLocked ? "locked" : ""}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
    >
      <div ref={toolbarRef}>
        <Toolbar
          selectedNoteId={selectedNoteId}
          styles={selectedNote ? selectedNote.data.styles : {}}
          onStyleChange={handleStyleChange}
          editingNoteId={editingNoteId}
        />
      </div>
      {/* <div className="menu">
        <button className="add-button" onClick={addNote}>
          +
        </button>
        <select
          name="noteTypesSelecter"
          className="note-types-selector"
          onChange={(e) => setSelectedNoteType(e.target.value)}
        >
          <option value="textNote">Boş Not</option>
          <option value="todoNote">Yapılacaklar Listesi</option>
        </select>
        <button
          onClick={() => {
            setIsLocked(!isLocked);
            window.getSelection().removeAllRanges();
          }}
        >
          {isLocked ? "Unlock Notes" : "Lock Notes"}
        </button>
      </div> */}
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

      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          isEditing={editingNoteId === note.id}
          isLocked={isLocked}
          onEditStart={() => setEditingNoteId(note.id)}
          onEditEnd={() => setEditingNoteId(null)}
          onClick={() => setSelectedNoteId(note.id)}
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
        />
      ))}
    </div>
  );
}

export default App;

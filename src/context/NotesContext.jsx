/* eslint-disable react-refresh/only-export-components */

import { createContext, useState } from "react";

export const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [selectedNoteType, setSelectedNoteType] = useState("textNote");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

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

  const updateNoteDataAttr = (id, attr, value) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, data: { ...note.data, [attr]: value } }
          : note
      )
    );
  };

  const updateStyle = (newStyles) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === selectedNoteId
          ? { ...note, data: { ...note.data, styles: newStyles } }
          : note
      )
    );
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        addNote,
        deleteNote,
        updateNotePosition,
        updateNoteSize,
        updateNoteDataAttr,
        updateStyle,
        selectedNoteId,
        setSelectedNoteId,
        editingNoteId,
        setEditingNoteId,
        selectedNoteType,
        setSelectedNoteType,
        isLocked,
        setIsLocked,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

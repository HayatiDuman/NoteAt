/* eslint-disable react-refresh/only-export-components */

import { createContext, useEffect, useState } from "react";

export const NotesContext = createContext();

export function NotesProvider({ children }) {
  const getInitialData = () => {
    const saved = localStorage.getItem("noteat-data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        console.error("LocalStorage parse hatası!");
      }
    }
  };

  const initialData = getInitialData() || {};

  const [notes, setNotes] = useState(initialData.notes || []);
  const [selectedNoteType, setSelectedNoteType] = useState(
    initialData.selectedNoteType || "textNote"
  );
  const [selectedNoteId, setSelectedNoteId] = useState(
    initialData.selectedNoteId || null
  );
  const [editingNoteId, setEditingNoteId] = useState(
    initialData.editingNoteId || null
  );
  const [isLocked, setIsLocked] = useState(initialData.isLocked || false);
  const [zIndexCounter, setZIndexCounter] = useState(
    initialData.zIndexCounter || 1
  );
  const [notesZIndex, setNotesZIndex] = useState(initialData.notesZIndex || {}); // { noteId: zIndex }

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

  const bringNoteToFront = (noteId) => {
    setNotesZIndex((prev) => ({
      ...prev,
      [noteId]: zIndexCounter,
    }));
    setZIndexCounter((prev) => prev + 1);
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

  useEffect(() => {
    const savedData = localStorage.getItem("noteat-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.selectedNoteType)
          setSelectedNoteType(parsed.selectedNoteType);
        if (parsed.selectedNoteId) setSelectedNoteId(parsed.selectedNoteId);
        if (parsed.editingNoteId) setEditingNoteId(parsed.editingNoteId);
        if (parsed.isLocked) setIsLocked(parsed.isLocked);
        if (parsed.zIndexCounter) setZIndexCounter(parsed.zIndexCounter);
        if (parsed.notesZIndex) setNotesZIndex(parsed.notesZIndex);
      } catch (e) {
        console.error("LocalStorage parse hatası:", e);
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      notes,
      selectedNoteType,
      selectedNoteId,
      editingNoteId,
      isLocked,
      zIndexCounter,
      notesZIndex,
    };
    localStorage.setItem("noteat-data", JSON.stringify(data));
  }, [
    notes,
    selectedNoteType,
    selectedNoteId,
    editingNoteId,
    isLocked,
    zIndexCounter,
    notesZIndex,
  ]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        notesZIndex,
        bringNoteToFront,
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

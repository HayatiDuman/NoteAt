import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

export const useNotes = () => useContext(NotesContext);

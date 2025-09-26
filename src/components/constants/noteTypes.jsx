import React from "react";
import EmptyNote from "../notes/EmptyNote";
import ToDoNote from "../notes/ToDoNote";

const noteTypes = {
  textNote: { component: EmptyNote, placeholder: "Yeni not..." },
  todoNote: { component: ToDoNote, placeholder: "Yeni görev..." },
};

export default noteTypes;

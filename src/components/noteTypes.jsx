import React from "react";
import EmptyNote from "./EmptyNote";
import ToDoNote from "./ToDoNote";

const noteTypes = {
  textNote: { component: EmptyNote, placeholder: "Yeni not..." },
  todoNote: { component: ToDoNote, placeholder: "Yeni görev..." },
};

export default noteTypes;

import React from "react";
import EmptyNote from "../notes/EmptyNote";

const noteTypes = {
  textNote: { component: EmptyNote, placeholder: "Yeni not..." },
  // todoNote: { component: ToDoNote, placeholder: "Yeni görev..." },
};

export default noteTypes;

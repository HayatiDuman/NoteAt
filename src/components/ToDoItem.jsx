import React from "react";
import TextInput from "./TextInput";
import "./ToDoItem.css";

function ToDoItem({
  id,
  placeholder,
  content,
  styles,
  isEditing,
  isChecked,
  onDeleteTodoItem,
  onChangeInTodoItem,
}) {
  return (
    <div className="todo-item">
      <label className="custom-checkbox">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onChangeInTodoItem({ isChecked: e.target.checked })}
          name="todoItemCheckbox"
          className="checkbox"
          id={"todoCheckbox" + id}
        />
        <span className="checkmark"></span>
      </label>
      <TextInput
        placeholder={placeholder}
        content={content}
        styles={styles}
        isEditing={isEditing}
        isChecked={isChecked}
        // data çoklu property içerdiği için
        onContentChange={(newText) => onChangeInTodoItem({ text: newText })}
      />
      <button
        className="todoItem-delete-button"
        disabled={false}
        onClick={onDeleteTodoItem}
      >
        <img
          src="/src/assets/bin.png"
          alt="Yapılacaklar listesi elemanı silme butonu."
          draggable={false}
        />
      </button>
    </div>
  );
}

export default ToDoItem;

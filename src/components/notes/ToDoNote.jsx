import ToDoItem from "./ToDoItem";
import "./ToDoNote.css";

function ToDoNote({
  placeholder,
  data = { todoItems: [] },
  isEditing,
  onDataChange,
}) {
  const todoItems = data?.todoItems ?? [];

  const addTodoItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      text: "",
      isChecked: false,
    };
    const updatedList = [...data.todoItems, newItem];
    onDataChange({ ...data, todoItems: updatedList });
  };

  const deleteTodoItem = (id) => {
    const updatedList = data.todoItems.filter((todoItem) => todoItem.id !== id);
    onDataChange({ ...data, todoItems: updatedList });
  };

  const updateTodoItem = (id, updatedFields) => {
    const updatedList = data.todoItems.map((todoItem) =>
      todoItem.id === id ? { ...todoItem, ...updatedFields } : todoItem
    );
    console.log("todoItem list güncellendi!");

    onDataChange({ ...data, todoItems: updatedList });
  };

  return (
    <div className="todo-container">
      {todoItems.map((todoItem) => (
        <ToDoItem
          key={todoItem.id}
          placeholder={placeholder}
          content={todoItem.content}
          styles={todoItem.styles}
          isChecked={todoItem.isChecked}
          isEditing={isEditing}
          onChangeInTodoItem={(fields) => updateTodoItem(todoItem.id, fields)}
          onDeleteTodoItem={() => deleteTodoItem(todoItem.id)}
        />
      ))}
      <button onClick={addTodoItem}>Ekle</button>
    </div>
  );
}

export default ToDoNote;

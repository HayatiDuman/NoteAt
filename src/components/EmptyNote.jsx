import React from "react";
import TextInput from "./TextInput";

function EmptyNote({ placeholder, data, isEditing, onDataChange }) {
  const { content, styles } = data;

  const onContentChange = (textValue) => {
    const newData = { ...data, content: textValue };
    onDataChange(newData);
  };

  return (
    <TextInput
      placeholder={placeholder}
      content={content}
      styles={styles}
      isEditing={isEditing}
      onContentChange={onContentChange}
    />
  );
}

export default EmptyNote;

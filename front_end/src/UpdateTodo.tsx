import React from 'react';

interface UpdateTodoProps {
  value: string;
  setValue: (value: string) => void;
  onUpdate: (content: string) => void;
  onCancel: () => void;
}

function UpdateTodo(props: UpdateTodoProps) {
  function setValue(value: string) {
    props.setValue(value);
  }

  function onUpdate(content: string) {
    props.onUpdate(content);
  }

  function onCancel() {
    props.onCancel();
  };

  return (
    <div>
      <input
        type='text'
        value={props.value}
        onChange={(e): void => setValue(e.target.value)}
      />
      <button onClick={() => onUpdate(props.value)}>更新</button>
      <button onClick={() => onCancel()}>キャンセル</button>
    </div>
  );
};

export default UpdateTodo;
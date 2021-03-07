import React from 'react';

interface CreateTodoProps {
  value: string;
  onCreate: (content: string) => void;
  setValue: (value: string) => void;
};

function CreateTodo(props: CreateTodoProps) {
  function onCreate(content: string) {
    props.onCreate(content);
  };

  function setValue(value: string) {
    props.setValue(value);
  };

  return (
    <div>
      <h1>新規作成</h1>
      <input 
        type='text'
        value={props.value}
        onChange={(e): void => setValue(e.target.value)}
      />
      <button onClick={() => onCreate(props.value)}>作成</button>
    </div>
  );
};

export default CreateTodo;
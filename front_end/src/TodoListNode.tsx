import React from 'react';
import { TodoList } from './Todolist';

interface TodoListNodeProps {
  todoList: TodoList[];
  onEdit: (id:number) => void;
  onDelete: (id: number) => void;
}

function TodoListNode(props: TodoListNodeProps) {
  function onEdit(id: number) {
    props.onEdit(id);
  };

  function onDelete(id: number) {
    props.onDelete(id);
  };
 
  const todoListNode = props.todoList.map((element: TodoList) => {
    return (
      <li key={element.id}>
        {element.content}
        <button onClick={() => onEdit(element.id)}>編集</button>
        <button onClick={() => onDelete(element.id)}>削除</button>
      </li>
    )
  });

  return (
    <div>
      <h1>Todoリスト一覧</h1>
        <ul>
          {todoListNode}
        </ul>
    </div>
  );
}

  export default TodoListNode;
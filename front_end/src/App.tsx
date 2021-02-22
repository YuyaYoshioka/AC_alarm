import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { TodoList } from './Todolist'
import ReactModal from 'react-modal';

function App() {
  const [todoList, setTodoList] = useState([] as TodoList[]);
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(-1);

  function getTodos() {
    axios.get(`http://localhost:3001/todos`)
      .then(res => {
        setTodoList(res.data);
      });
  };

  useEffect(() => {
    getTodos();
  },[setTodoList]);

  function handleCreate() {
    const todo = {
      content: value
    }

    axios.post('http://localhost:3001/todos', { todo })
      .then(() => {
        getTodos();
        setValue('');
      })
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleDelete(id: number): void {
    axios.delete('http://localhost:3001/todos/' + id)
      .then(() => {
        getTodos();
      });
  };

  function handleEdit(id: number):void {
    axios.get('http://localhost:3001/todos/' + id)
      .then(res => {
        setValue(res.data['content']);
      });
    setIsOpen(true);
    setEditId(id);
  }

  function handleUpdate() {
    axios.patch('http://localhost:3001/todos/' + editId, {'content': value})
      .then(() => {
        getTodos();
      });
    setValue('');
    setEditId(-1);
    setIsOpen(false);
  }

  function handleCancel() {
    setValue('');
    setIsOpen(false);
  }

  const todoListNode = todoList.map((element: TodoList) => {
    return (
      <li key={element.id}>
        {element.content}
        <button onClick={() => handleEdit(element.id)}>編集</button>
        <button onClick={() => handleDelete(element.id)}>削除</button>
      </li>
    )
  });

  return (
    <div>
      <div>
        <ReactModal
          isOpen={isOpen}
          ariaHideApp={false}
        >
          <input
            type='text'
            value={value}
            onChange={handleChange}
          />
          <button onClick={() => handleUpdate()}>編集</button>
          <button onClick={() => handleCancel()}>キャンセル</button>
        </ReactModal>
        <h1>Todoリスト一覧</h1>
        <ul>
          {todoListNode}
        </ul>
      </div>
      <div>
        <h1>新規作成</h1>
        <input 
          type="text"
          value={value}
          onChange={(e) => handleChange(e)}
        />
        <button onClick={() => handleCreate()}>作成</button>
      </div>
      
    </div>
  );
}

export default App;

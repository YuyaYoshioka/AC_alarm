import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import TodoListNode from './TodoListNode'
import CreateTodo from './CreateTodo'
import UpdateTodo from './UpdateTodo'
import axios from 'axios';
import { TodoList } from './Todolist'



function Todo() {
  const [todoList, setTodoList] = useState([] as TodoList[]);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [editId, setEditId] = useState(-1);

  function getTodos() {
    axios.get(`http://localhost:3001/todos`)
      .then(res => {
        setTodoList(res.data);
      });
  };

  useEffect(() => {
    getTodos();
  },[]);

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


  return (
    <div>
      <div>
        <ReactModal
          isOpen={isOpen}
          ariaHideApp={false}
        >
          <UpdateTodo
            value={value}
            setValue={(value): void => setValue(value)}
            onUpdate={handleUpdate}
            onCancel={handleCancel}
          />
        </ReactModal>
      </div>

        <TodoListNode
          todoList={todoList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <CreateTodo
          onCreate={handleCreate}
          value={value}
          setValue={(value): void => setValue(value)}
        />
      </div>
    );
};

export default Todo;
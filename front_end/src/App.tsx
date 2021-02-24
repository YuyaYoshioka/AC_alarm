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
  const [alarmTime, setAlarmTime] = useState('09:00');
  const [isAlarmOn, setIsAlarmOn] = useState('false');
  const [userID, setUserID] = useState('');

  function getTodos() {
    axios.get(`http://localhost:3001/todos`)
      .then(res => {
        setTodoList(res.data);
      });
  };

  useEffect(() => {
    getTodos();
    const cookies = document.cookie; 
    const cookiesArray = cookies.split(';'); 
    for(const for_cookie of cookiesArray) { 
        const split_cookie = for_cookie.split('=');
        if (split_cookie[0].trim() === 'isAlarmOn') {
          setIsAlarmOn(split_cookie[1]);
        }
        if (split_cookie[0].trim() === 'userID') {
          setUserID(split_cookie[1]);
        }
    }
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

  function handleSetAlarm() {
    var contents: string = '';
    axios.get(`http://localhost:3001/todos`)
      .then(res => {
        for(const toDo of res.data) {
          contents += toDo['content'] + 'を頑張りましょう。';
        }
        contents += '起きてください。'
        const repeatContents: string = contents.repeat(1000);
        const speakContent = new SpeechSynthesisUtterance(repeatContents);
        const alarmTimeNumber:number = Number(alarmTime.slice(0, 2)) * 3600 + Number(alarmTime.slice(-2)) * 60;
        const currentDatetime = new Date();
        const currentTime:number = currentDatetime.getHours() * 3600 + currentDatetime.getMinutes()* 60 + currentDatetime.getSeconds();
        var restTime:number = 0;
        if (alarmTimeNumber > currentTime) {
          restTime = (alarmTimeNumber - currentTime);
        } else {
          restTime = (24*3600 + alarmTimeNumber -currentTime)
        }
        const alarmGetTime = currentDatetime.getTime() + restTime*1000;
        const speak = function(){
          speechSynthesis.speak(speakContent);
        };
        var timeoutID;
        timeoutID = setTimeout(speak, restTime*1000);
        document.cookie = 'timeoutID=' + timeoutID;
        document.cookie = 'alarmGetTime=' + alarmGetTime;
        document.cookie = 'isAlarmOn=true';
      });
  };

  function handleCancelAlarm() {
    const cookies = document.cookie; 
    const cookiesArray = cookies.split(';'); 
    var timeoutID;
    for(const for_cookie of cookiesArray) { 
        const split_cookie = for_cookie.split('=');
        if (split_cookie[0].trim() === 'timeoutID') {
          timeoutID = split_cookie[1];
        }
    }
    clearTimeout(Number(timeoutID));
    document.cookie = 'isAlarmOn=false';
  };

  function handleStopAlarm() {
    const url = "https://kenkoooo.com/atcoder/atcoder-api/results?user=" + userID;
    axios.get(url)
      .then(res => {
        var acTime = res.data[0].epoch_second
        for (const problem of res.data) {
          if (problem.result !== 'AC') {
            continue;
          }
          if (problem.epoch_second > acTime) {
            acTime = problem.epoch_second;
          }
        }
        var cookies = document.cookie; 
        var cookiesArray = cookies.split(';'); 
        var alarmGetTime: string = '';
        for(var for_cookie of cookiesArray){ 
            var split_cookie = for_cookie.split('=');
            if (split_cookie[0].trim() === 'alarmGetTime') {
              alarmGetTime = split_cookie[1];
            }
        }
        if (Number(alarmGetTime) < Number(acTime)*1000) {
          speechSynthesis.cancel();
        }
      }
    )
  }
  
  function handleUserID() {
    document.cookie = 'userID=' + userID;
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
      <header>
        <h1>AtCoder Alarm</h1>
        <input
          type='text'
          onKeyPress={(e): void => {
            if (e.key === 'Enter') {
              handleUserID();
            }
          }}
          value={userID}
          onChange={(e): void => setUserID(e.target.value)}
        />
      </header>

      <div>
        <ReactModal
          isOpen={isOpen}
          ariaHideApp={false}
        >
          <input
            type='text'
            value={value}
            onChange={(e): void => setValue(e.target.value)}
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
          type='text'
          value={value}
          onChange={(e): void => setValue(e.target.value)}
        />
        <button onClick={() => handleCreate()}>作成</button>
      </div>

      <div>
        <h1>起床時刻</h1>
        <input
          type='time'
          value={alarmTime}
          onChange={(e): void => setAlarmTime(e.target.value)}
        />
        <button onClick={() => handleSetAlarm()}>アラームをセットする</button>
        <button onClick={() => handleCancelAlarm()}>アラームを解除する</button>
        <button onClick={() => handleStopAlarm()}>アラームを止める</button>
      </div>
    </div>
  );
}

export default App;

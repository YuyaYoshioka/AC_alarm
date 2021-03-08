import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Alarm() {
  const [alarmTime, setAlarmTime] = useState('09:00');
  const [isAlarmOn, setIsAlarmOn] = useState('false');
  const [userID, setUserID] = useState('');

  useEffect(() => {
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

  function handleSetAlarm() {
    let contents: string = '';
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
        let restTime:number = 0;
        if (alarmTimeNumber > currentTime) {
          restTime = (alarmTimeNumber - currentTime);
        } else {
          restTime = (24*3600 + alarmTimeNumber -currentTime)
        }
        const alarmGetTime = currentDatetime.getTime() + restTime*1000;
        const speak = function(){
          speechSynthesis.speak(speakContent);
        };
        let timeoutID;
        timeoutID = setTimeout(speak, restTime*1000);
        document.cookie = 'timeoutID=' + timeoutID;
        document.cookie = 'alarmGetTime=' + alarmGetTime;
        document.cookie = 'isAlarmOn=true';
      });
  };

  function handleCancelAlarm() {
    const cookies = document.cookie; 
    const cookiesArray = cookies.split(';'); 
    let timeoutID;
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
        let acTime = res.data[0].epoch_second
        for (const problem of res.data) {
          if (problem.result !== 'AC') {
            continue;
          }
          if (problem.epoch_second > acTime) {
            acTime = problem.epoch_second;
          }
        }
        let cookies = document.cookie; 
        let cookiesArray = cookies.split(';'); 
        let alarmGetTime: string = '';
        for(const for_cookie of cookiesArray){ 
            let split_cookie = for_cookie.split('=');
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

  return(
    <div>
      <header>
        <ul>
          <li>
            <h1>
              <Link to='/'>AtCoder Alarm</Link>
            </h1>
          </li>
          <li>
            <Link to='/todos'>Todoリスト</Link>
          </li>
        </ul>
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
};

export default Alarm
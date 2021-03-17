import React from 'react';
import Alarm from './Alarm'
import Todo from './Todo'
import Navigation from './Navigation';
import {
  HashRouter as Router,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Navigation />
        <Route exact path='/' component={Alarm}></Route>
        <Route path='/todos' component={Todo}></Route>
      </Router>
    </div>
  );
}

export default App;

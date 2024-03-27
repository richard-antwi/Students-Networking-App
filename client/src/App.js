
import './App.css';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import Messages from './Components/Messages';
// import { Router } from 'express';
// import React, { useRef } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
      <div className="Content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/messages">
            <Messages />
          </Route>
        </Switch>
      </div>
    </div>
    </Router>
  );
}

export default App;

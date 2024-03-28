
import './App.css';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import Messages from './Components/Messages';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Switch } from 'react-router-dom';

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
          <Route path="/Mssages">
            <Messages />
          </Route>
        </Switch>
      </div>
    </div>
    </Router>
  );
}

export default App;

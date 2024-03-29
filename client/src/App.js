
import './App.css';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import Messages from './Components/Messages';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
// import { Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
      <div className="Content">
        <Routes>
          <Route path="/" element={<NavBar />} />
          <Route index element={<Home />} />
          <Route exact path="/" element={<NavBar />} />
            <Home />
         
          <Route path="/Mssages">
            <Messages />
          </Route>
        </Routes>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;

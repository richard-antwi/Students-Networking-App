
import './App.css';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import About from './Components/About';
import Messages from './Components/Messages';
import Layout from './Components/Layout';
import Footer from './Components/Footer';
import Forum from './Components/Forum';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
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
          <Route path="messages" element={<Messages />} />
          <Route path="about" element={<Layout><About /></Layout>} />
          <Route path="footer" element={<Footer />} />
          <Route path="forum" element={<Forum />} />
        </Routes>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;

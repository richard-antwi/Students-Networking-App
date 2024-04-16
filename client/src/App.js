// App.js
import './App.css';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import About from './Components/About';
import Messages from './Components/Messages';
import Layout from './Components/Layout';
// import Footer from './Components/Footer';
import Forum from './Components/Forum';
import ForumNav from './Components/ForumNav';
import Profiles from './Components/Profiles';
import Projects from './Components/Projects';
import MyProfile from './Components/MyProfile';
import ForumPostView from './Components/ForumPostView';
import Register from './Components/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* For routes that include NavBar */}
          <Route path="/" element={<LayoutWithNav><Home /></LayoutWithNav>} />
          <Route path="messages" element={<LayoutWithNav><Messages /></LayoutWithNav>} />
          <Route path="about" element={<LayoutWithNav><About /></LayoutWithNav>} />
          <Route path="forum" element={<LayoutWithNav><Layout><Forum /></Layout></LayoutWithNav>} />
          <Route path="projects" element={<LayoutWithNav><Layout><Projects /></Layout></LayoutWithNav>} />
          <Route path="forumnav" element={<LayoutWithNav><ForumNav /></LayoutWithNav>} />
          <Route path="profiles" element={<LayoutWithNav><Profiles /></LayoutWithNav>} />
          <Route path="myprofile" element={<LayoutWithNav><MyProfile /></LayoutWithNav>} />
          <Route path="forumpostview" element={<LayoutWithNav><ForumPostView /></LayoutWithNav>} />

          {/* For routes without NavBar */}
          <Route path="register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Assuming Layout is your component where you want to include NavBar,
// or you can create a new component that renders NavBar and its children.
function LayoutWithNav({ children }) {
  return (
    <>
      <NavBar />
      <div className="Content">
        {children}
      </div>
    </>
  );
}

export default App;

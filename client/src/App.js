import React from 'react';
import './App.css';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import About from './Components/About';
import Messages from './Components/Messages';
import Layout from './Components/Layout';
import Footer from './Components/Footer';
import Forum from './Components/Forum';
import ForumNav from './Components/ForumNav';
import ForumPostView from './Components/ForumPostView';
import Register from './Components/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route
            element={
              <>
                <NavBar />
                <div className="Content">
                  <Routes>
                    <Route index element={<Home />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="about" element={<Layout><About /></Layout>} />
                    <Route path="footer" element={<Footer />} />
                     <Route path="forum" element={<Layout><Forum /></Layout>} />
                    <Route path="forumnav" element={<ForumNav />} />
                    <Route path="forumpostview" element={<ForumPostView />} />
                    <Route path="register" element={<Register />} />
                  </Routes>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
import React, { useState } from 'react';
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
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const handleLogin = () => {
    // Perform login logic here
    // Set isLoggedIn to true upon successful login
  //   setIsLoggedIn(true);
  // };

  return (
    <BrowserRouter>
      <div className="App">
        {/* <NavBar isLoggedIn={isLoggedIn} /> */}
        <NavBar />
        <div className="Content">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/home" /> : <Register onLogin={handleLogin} />
              }
            />
            <Route path="/home" element={<Home />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/forum" element={<Layout><Forum /></Layout>} />
            <Route path="/forumnav" element={<ForumNav />} />
            <Route path="/forumpostview" element={<ForumPostView />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
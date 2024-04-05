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
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <div className="Content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="messages" element={<Messages />} />
            <Route path="about" element={<Layout><About /></Layout>} />
            <Route path="footer" element={<Footer />} />
            <Route path="forum" element={<Layout><Forum /></Layout>} />
            <Route path="forumnav" element={<ForumNav />} />
            <Route path="forumpostview" element={<ForumPostView />} />
            <Route path="register" element={<RegisterWithCSSLink />} />
          </Routes>
         
        </div>
      </div>
    </BrowserRouter>
  );
}

// Component for Register with CSS link
function RegisterWithCSSLink() {
  const location = useLocation();

  // Check if the current location matches the "register" path
  if (location.pathname === "/register") {
    return (
      <>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/7.1.0/mdb.min.css"
          rel="stylesheet"
        />
        <Register />
      </>
    );
  }

  return <Register />;
}

export default App;
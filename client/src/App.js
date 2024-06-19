import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './Components/About';
import AccountSettings from './Components/AccountSettings';
import Forum from './Components/Forum';
import ForumNav from './Components/ForumNav';
import ForumPostView from './Components/ForumPostView';
import FrequentlyAskedQuestions from './Components/FrequentlyAskedQuestions';
import HelpCenter from './Components/HelpCenter';
import Home from './Components/Home';
import Layout from './Components/Layout';
import Messages from './Components/Messages';
import MyProfile from './Components/MyProfile';
import PolicyPrivacy from './Components/PolicyPrivacy';
import Profiles from './Components/Profiles';
import Projects from './Components/Projects';
import Register from './Components/Register';
import NavBar from './Components/NavBar';
import TopProfiles from './Components/TopProfiles';
import Logout from './Components/Logout';


function App() {
  
  return (
    <>
              
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Routes that include NavBar */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="messages" element={<Messages />} />
            <Route path="about" element={<About />} />
            <Route path="forum" element={<Forum />} />
            <Route path="projects" element={<Projects />} />
            <Route path="forumnav" element={<ForumNav />} />
            <Route path="profiles" element={<Profiles />} />
            <Route path="myprofile" element={<MyProfile />} />
            <Route path="forumpostview" element={<ForumPostView />} />
            <Route path="accountsettings" element={<AccountSettings />} />
            <Route path="frequentlyaskedquestions" element={<FrequentlyAskedQuestions />} />
            <Route path="policyprivacy" element={<PolicyPrivacy />} />
            <Route path="helpcenter" element={<HelpCenter />} />
            <Route path="topprofiles" element={<TopProfiles />} />
            <Route path="messages/:friendId" element={<Messages />} />
            <Route path="logout" element={<Logout />} />
          </Route>

          {/* Route without NavBar */}
          <Route path="register" element={<Register />} />
          <Route path="navbar" element={<NavBar />} />
          

        </Routes>
    
      </div>
    </BrowserRouter>
    </>
  );
}

export default App;


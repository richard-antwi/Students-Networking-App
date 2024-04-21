import './App.css';
import Home from './Components/Home';
import About from './Components/About';
import Messages from './Components/Messages';
import AccountSettings from './Components/AccountSettings';
import Forum from './Components/Forum';
import ForumNav from './Components/ForumNav';
import Profiles from './Components/Profiles';
import Projects from './Components/Projects';
import MyProfile from './Components/MyProfile';
import ForumPostView from './Components/ForumPostView';
import Register from './Components/Register';
import Layout from './Components/Layout'; // Make sure to import the Layout component
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
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
          </Route>

          {/* Route without NavBar */}
          <Route path="register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


// // App.js
// import './App.css';
// import LayoutWithNav from './Components/LayoutWithNav';
// import Home from './Components/Home';
// import About from './Components/About';
// import Messages from './Components/Messages';
// import Layout from './Components/Layout';
// import AccountSettings from './Components/AccountSettings';
// import Forum from './Components/Forum';
// import ForumNav from './Components/ForumNav';
// import Profiles from './Components/Profiles';
// import Projects from './Components/Projects';
// import MyProfile from './Components/MyProfile';
// import ForumPostView from './Components/ForumPostView';
// import Register from './Components/Register';
// import { BrowserRouter, Routes, Route,  } from 'react-router-dom';
// import {Outlet} from 'react-router-dom';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// function App() {
//   return (
//     <>
//     <BrowserRouter>
//       <div className="App">
//         <Routes>
//           {/* For routes that include NavBar */}
//           <Route path="/" element={<LayoutWithNav><Home /></LayoutWithNav>} />
//           <Route path="messages" element={<LayoutWithNav><Messages /></LayoutWithNav>} />
//           <Route path="about" element={<LayoutWithNav><About /></LayoutWithNav>} />
//           <Route path="forum" element={<LayoutWithNav><Layout><Forum /></Layout></LayoutWithNav>} />
//           <Route path="projects" element={<LayoutWithNav><Layout><Projects /></Layout></LayoutWithNav>} />
//           <Route path="forumnav" element={<LayoutWithNav><ForumNav /></LayoutWithNav>} />
//           <Route path="profiles" element={<LayoutWithNav><Profiles /></LayoutWithNav>} />
//           <Route path="myprofile" element={<LayoutWithNav><MyProfile /></LayoutWithNav>} />
//           <Route path="forumpostview" element={<LayoutWithNav><ForumPostView /></LayoutWithNav>} />
//           <Route path="accountsettings" element={<LayoutWithNav><AccountSettings /></LayoutWithNav>} />
          
//           {/* For routes without NavBar */}
//           <Route path="register" element={<Register />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//      <Outlet />
//      </>
//   );
// }



// export default App;



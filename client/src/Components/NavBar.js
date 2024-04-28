import React from 'react';
import '../App.css';
import avatar from '../Images/avatar.webp';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { faBolt, faCity, faHome, faMessage, faPuzzlePiece, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Outlet } from 'react-router-dom';
import { ProfileContext } from './ProfileContext'; //to import profile image
import { useContext } from 'react'; //to import for profile image


function NavBar() {
  const { imageUrl } = useContext(ProfileContext);

  return (
    <>
      {/* Navigation Bar */}
      
      <nav className="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
      <a className="navbar-brand" href="home.html">Social Networking App</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <form className="form-inline my-2 my-lg-0">
        <div className="input-group">
          <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
          <div className="input-group-append">
            <button className="btn btn-success" type="submit">Search</button>
          </div>
        </div>
      </form>
      <div className="collapse navbar-collapse mt-3" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              {/* <i className="fas fa-home" style={{color: 'white'}} /> */}
              <FontAwesomeIcon icon={faHome} style={{ color: 'white' }} />
              <Link to="/" className="nav-link" >Home</Link>
            </div>
          </li>
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              {/* <i className="fas fa-puzzle-piece" style={{color: 'white'}} /> */}
              <FontAwesomeIcon icon={faPuzzlePiece} style={{ color: 'white' }} />
              <Link to="/projects" className="nav-link" >Projects</Link>
            </div>
          </li>
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              {/* <i className="fas fa-users" style={{color: 'white'}} /> */}
              <FontAwesomeIcon icon={faUser} style={{ color: 'white' }} />
              <Link to="profiles" className="nav-link" >Profiles</Link>
            </div>
          </li>
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              {/* <i className="fas fa-message" style={{color: 'white'}} /> */}
              <FontAwesomeIcon icon={faMessage} style={{ color: 'white' }} />
              <Link to="messages" className="nav-link" >Messages</Link>
            </div>
          </li>
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              {/* <i className="fas fa-message" style={{color: 'white'}} /> */}
              <FontAwesomeIcon icon={faCity} style={{ color: 'white' }} />
              <Link to="forum" className="nav-link" >Forum</Link>
            </div>
          </li>
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              {/* <i className="fas fa-bolt" style={{color: 'white'}} /> */}
              <FontAwesomeIcon icon={faBolt} style={{ color: 'white' }} />
              <Link to="notification" className="nav-link" >
                Notification</Link>
            </div>
          </li>
          <li>
            <div className="dropdown mr-5">
              <Link to="/" className="nav-link dropdown-toggle" role="button" id="profileDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {/* <img src={avatar} alt="Avatar" className="avatar-img small-avatar" /> */}
                {imageUrl ? (
                    <img src={imageUrl} alt="Profile" className="avatar-img small-avatar" />
                  ) : (
                    <img src={avatar} alt="Default Profile" className="avatar-img small-avatar" />
                  )}
                John Doe
              </Link>
              <div className="dropdown-menu mr-7" aria-labelledby="profileDropdown">
                {/* Dropdown items go here */}
                <div className="dropdown-item">
                  <p>Online Status</p>
                  <div className="dropdown-divider" />
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="status" id="onlineRadio" defaultChecked />
                    <label className="form-check-label" htmlFor="onlineRadio">
                      Online
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="status" id="offlineRadio" />
                    <label className="form-check-label" htmlFor="offlineRadio">
                      Offline
                    </label>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <div className="dropdown-item">
                  <h6>Custom Status</h6>
                </div>
                <div className="dropdown-divider" />
                {/* Input field and Submit button */}
                <div className="dropdown-item">
                  <form>
                    <div className="form-group">
                      <input type="text" className="form-control" id="customStatusInput" placeholder="Enter custom status" />
                      <button type="submit" className="btn btn-primary">OK</button>
                    </div>
                  </form>
                </div>
                <div className="dropdown-divider" />
                <div className="dropdown-item">
                  <h6>Settings</h6>
                </div>
                <div className="dropdown-divider" />
                <Link to="accountsettings" className="dropdown-item" >Acount Settings</Link>
                <Link to="about" className="dropdown-item" >About</Link>
                <Link to="policyprivacy" className="dropdown-item">Privacy</Link>
                <Link to="frequentlyaskedquestions" className="dropdown-item" >FAQs</Link>
                <Link to="helpcenter" className="dropdown-item" >Help Center</Link>
                <Link to="/" className="dropdown-item" href="terms_and_conditions.html">Terms &amp; Conditions</Link>
                <div className="dropdown-divider" />
                <div className ="dropdown-item">
                  <Link to="/" className="dropdown-item" href="logout.html">Logout</Link>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <Outlet />
    </>
  );
}

export default NavBar;





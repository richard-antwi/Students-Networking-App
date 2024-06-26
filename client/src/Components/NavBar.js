// src/Components/NavBar.js
import '../App.css';
import avatar from '../Images/avatar.webp';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { faBolt, faCity, faHome, faMessage, faPuzzlePiece, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function NavBar() {
  const [profileData, setProfileData] = useState({
    profileImagePath: '',
    firstName: '',
    lastName: '',
    userName: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data) {
          setProfileData({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            userName: response.data.userName,
            profileImagePath: response.data.profile.profileImagePath
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const imagePath = profileData.profileImagePath.replace(/\\/g, '/');
  const imageUrl = `http://localhost:3001/${imagePath}`;

  return (
    <>
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
                <FontAwesomeIcon icon={faHome} style={{ color: 'white' }} />
                <Link to="/" className="nav-link">Home</Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="d-flex flex-column align-items-center">
                <FontAwesomeIcon icon={faPuzzlePiece} style={{ color: 'white' }} />
                <Link to="/projects" className="nav-link">Projects</Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="d-flex flex-column align-items-center">
                <FontAwesomeIcon icon={faUser} style={{ color: 'white' }} />
                <Link to="profiles" className="nav-link">Profiles</Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="d-flex flex-column align-items-center">
                <FontAwesomeIcon icon={faMessage} style={{ color: 'white' }} />
                <Link to="messages" className="nav-link">Messages</Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="d-flex flex-column align-items-center">
                <FontAwesomeIcon icon={faCity} style={{ color: 'white' }} />
                <Link to="forum" className="nav-link">Forum</Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="d-flex flex-column align-items-center">
                <FontAwesomeIcon icon={faBolt} style={{ color: 'white' }} />
                <Link to="notification" className="nav-link">Notification</Link>
              </div>
            </li>
            <li>
              <div className="dropdown mr-5">
                <Link to="/" className="nav-link dropdown-toggle" role="button" id="profileDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {profileData.profileImagePath ? (
                    <img src={imageUrl} alt="Avatar" className="avatar-img small-avatar" />
                  ) : (
                    <img src={avatar} alt="Default Avatar" className="avatar-img small-avatar" />
                  )}
                  {profileData.firstName} {profileData.lastName}
                </Link>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="profileDropdown">
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
                    <form>
                      <div className="form-group">
                        <input type="text" className="form-control" id="customStatusInput" placeholder="Enter custom status" />
                        <button type="submit" className="btn btn-primary btn-sm mt-2">OK</button>
                      </div>
                    </form>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="accountsettings" className="dropdown-item">Account Settings</Link>
                  <Link to="about" className="dropdown-item">About</Link>
                  <Link to="policyprivacy" className="dropdown-item">Privacy</Link>
                  <Link to="frequentlyaskedquestions" className="dropdown-item">FAQs</Link>
                  <Link to="helpcenter" className="dropdown-item">Help Center</Link>
                  <Link to="/" className="dropdown-item">Terms &amp; Conditions</Link>
                  <div className="dropdown-divider" />
                  <Link to="/logout" className="dropdown-item">Logout</Link>
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

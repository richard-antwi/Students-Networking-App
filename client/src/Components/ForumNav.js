
// import avatar from '../Images/avatar.webp';
// import connectPhoto from '../Images/connectPhoto.png';
// import coverPhoto2 from '../Images/coverPhoto2.avif';
// import React, { useState, useEffect } from 'react';
// import $ from 'jquery';
import {Outlet, Link, NavLink} from 'react-router-dom';
// import { faBolt, faHome, faMessage, faPuzzlePiece, faUser, faComments } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap'; 


function ForumNav() {
    return (
        <>
        <div>
          {/* Navigation Bar */}
          <nav className="navbar navbar-expand-md navbar-dark bg-primary fixed-top mt-6">
            <a className="navbar-brand ml-5" href="home.html">Forum</a>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link to="/" className="nav-link" >Tag</Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link to="/" className="nav-link" >Users</Link>
                  </div>  
                </li>
                <button className="btn btn-white text-primary" type="submit">Ask a Question</button>
              </ul>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <form className="form-inline my-2 my-lg-0">
                <div className="input-group">
                  <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
                  <div className="input-group-append">
                    <button className="btn btn-success" type="submit"><i className="fas fa-search" style={{color: 'white'}} /></button>
                  </div>
                </div>
                <button className="btn btn-success ml-3" type="submit">Login</button>
                <button className="btn btn-success ml-3" type="submit">Register</button>
              </form>
            </div> 
          </nav>
          {/* Navigation Bar */}
          <nav className="navbar navbar-expand-md navbar-dark bg-white mt-12">
            <div className="collapse navbar-collapse " id="navbarNav">
              <ul className="navbar-nav mr-auto ml-5">
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link to="/" className="nav-link" id="color" >Latest</Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link to="/" className="nav-link " id="color" >Unanswered</Link>
                  </div>  
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <NavLink className="nav-link" id="color" >Trending</NavLink>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link to="/" className="nav-link" id="color" >Popular This Week</Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link to="/" className="nav-link" id="color" >Popular of Month</Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <i className="fas fa-message" style={{color: 'white'}} />
                    <a className="nav-link" href="messages.html">Messages</a>
                  </div>
                </li>
              </ul>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
          </nav>
        </div>
        <Outlet />
        </>
          );
}

export default ForumNav;
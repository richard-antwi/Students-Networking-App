// import axios from 'axios';
import 'bootstrap';
// import {Outlet} from 'react-router-dom';
// import React, { useState } from 'react';
import "../App.css";
import avatar from '../Images/avatar.webp';

function Profiles() {
      return (
        <>
        <div>
          {/* Top Container */}
          <div className="container mt-5">
            <div className="row">
              <div className="col-md-12">
                <div className="bg-white text-left p-2 font-weight-bold">
                  {/* Content for the top container */}
                  <p>Something Here</p>
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-3">
            <div className="row">
              <div className="col-md-3">
                <div className="card">
                  <img src="img/avatar.webp" className="card-img-top mx-auto d-block avatar-img mt-5" alt="Avatar" />
                  <div className="card-body">
                    <p className="card-text text-center font-weight-bold">John Doe</p>
                    {/* Job Title */}
                    <p className="card-text text-center">Graphic Designer</p>
                    <div className="btn-group justify-content-center mb-3" role="group" aria-label="Card Buttons">
                      <button type="button" className="btn btn-success ml-3 mr-2">Follow</button>
                      <button type="button" className="btn btn-danger mr-2">
                        <i className="fas fa-envelope" />
                      </button>
                      <button type="button" className="btn btn-primary">Hire</button>
                    </div>
                    <div className="text-center">
                      <hr />
                      View Profile
                    </div>        
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <img src={avatar} className="card-img-top mx-auto d-block avatar-img mt-5" alt="Avatar" />
                  <div className="card-body">
                    <p className="card-text text-center font-weight-bold">John Doe</p>
                    {/* Job Title */}
                    <p className="card-text text-center">Graphic Designer</p>
                    <div className="btn-group justify-content-center mb-3" role="group" aria-label="Card Buttons">
                      <button type="button" className="btn btn-success ml-3 mr-2">Follow</button>
                      <button type="button" className="btn btn-danger mr-2">
                        <i className="fas fa-envelope" />
                      </button>
                      <button type="button" className="btn btn-primary">Hire</button>
                    </div>
                    <div className="text-center">
                      <hr />
                      View Profile
                    </div>        
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <img src={avatar} className="card-img-top mx-auto d-block avatar-img mt-5" alt="Avatar" />
                  <div className="card-body">
                    <p className="card-text text-center font-weight-bold">John Doe</p>
                    {/* Job Title */}
                    <p className="card-text text-center">Graphic Designer</p>
                    <div className="btn-group justify-content-center mb-3" role="group" aria-label="Card Buttons">
                      <button type="button" className="btn btn-success ml-3 mr-2">Follow</button>
                      <button type="button" className="btn btn-danger mr-2">
                        <i className="fas fa-envelope" />
                      </button>
                      <button type="button" className="btn btn-primary">Hire</button>
                    </div>
                    <div className="text-center">
                      <hr />
                      View Profile
                    </div>        
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <img src={avatar} className="card-img-top mx-auto d-block avatar-img mt-5" alt="Avatar" />
                  <div className="card-body">
                    <p className="card-text text-center font-weight-bold">John Doe</p>
                    {/* Job Title */}
                    <p className="card-text text-center">Graphic Designer</p>
                    <div className="btn-group justify-content-center mb-3" role="group" aria-label="Card Buttons">
                      <button type="button" className="btn btn-success ml-3 mr-2">Follow</button>
                      <button type="button" className="btn btn-danger mr-2">
                        <i className="fas fa-envelope" />
                      </button>
                      <button type="button" className="btn btn-primary">Hire</button>
                    </div>
                    <div className="text-center">
                      <hr />
                      View Profile
                    </div>        
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
       </>
       );
       }
 
 export default Profiles;
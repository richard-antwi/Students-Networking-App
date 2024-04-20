// import person1 from '../Images/person1.jpg';
// import person2 from '../Images/person2.jpg';
// import person3 from '../Images/person3.jpg';
// import person4 from '../Images/person4.jpg';
// import person5 from '../Images/person5.jpg';
// import avatar from '../Images/avatar.webp';
// import connectPhoto from '../Images/connectPhoto.png';
// import coverPhoto2 from '../Images/coverPhoto2.avif';
// import React, { useState, useEffect } from 'react';
// import $ from 'jquery';
import 'bootstrap'; 


function AccountSettings() {
    return (
        <>
  
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header card-header-custom">
                  <span className="float-left mr-2">
                    <i className="fas fa-cog text-primary" />
                  </span>
                  <h5 className="card-title text-primary">Account Settings</h5>
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="fas fa-chart-line trend-icon" /> Status
                  </h5>
                  <div className="status-line" />
                  <h5 className="card-title">
                    <i className="fas fa-lock lock-icon" /> Change Password
                  </h5>
                  <div className="status-line" />
                  <h5 className="card-title">
                    <i className="fas fa-bell trend-icon" /> Notification
                  </h5>
                  <div className="status-line" />
                  <h5 className="card-title">
                    <i className="fas fa-users trend-icon" /> Requests
                  </h5>
                  <div className="status-line" />
                  <h5 className="card-title">
                    <i className="fas fa-shield-alt trend-icon" /> Security and Login
                  </h5>
                  <div className="status-line" />
                  <h5 className="card-title">
                    <i className="fas fa-lock trend-icon" /> Privacy
                  </h5>
                  <div className="status-line" />
                  <h5 className="card-title">
                    <i className="fas fa-ban trend-icon" /> Blocking
                  </h5>
                  <div className="status-line" />
                  <h5 className="card-title">
                    <i className="fas fa-user-slash trend-icon" /> Deactivate Account
                  </h5>
                  <div className="status-line" />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header card-header-custom">
                  <h5 className="card-title text-primary">Account Settings</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Notification Sound</h5>
                    <div className="form-check form-switch">
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                  {/* Description */}
                  <p className="mt-2">Adjust your notification sound preferences here. Turn on/off notifications as needed.</p>
                  <div className="status-line" />
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Notification Email</h5>
                    <div className="form-check form-switch mt-2">
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                  {/* Description */}
                  <p className="mt-2">Adjust your notification sound preferences here. Turn on/off notifications as needed.</p>
                  <div className="status-line" />
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Chat Message Sound</h5>
                    <div className="form-check form-switch mt-2">
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                  {/* Description */}
                  <p className="mt-2">Adjust your notification sound preferences here. Turn on/off notifications as needed.</p>
                </div>
                <div className="card-footer custom-footer">
                  <button type="button" className="btn btn-primary">Save Settings</button>
                  <button type="button" className="btn btn-secondary">Restore Settings</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
          );
}

export default AccountSettings;
// import person1 from '../Images/person1.jpg';
// import person2 from '../Images/person2.jpg';
// import person3 from '../Images/person3.jpg';
// import person4 from '../Images/person4.jpg';
// import person5 from '../Images/person5.jpg';
import avatar from '../Images/avatar.webp';
// import connectPhoto from '../Images/connectPhoto.png';
// import coverPhoto2 from '../Images/coverPhoto2.avif';
// import React, { useState, useEffect } from 'react';
// import $ from 'jquery';
import 'bootstrap'; 
import ForumNav from '../Components/ForumNav';


function ForumPostView() {
    return (
        <>
   
  
        <div className="container mt-5">
          <div className="row">
            {/* Left Column with a larger width */}
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    {/* Left Section (Avatar) */}
                    <div className="col-md-2">
                      <img src="img/avatar.webp" className="img-fluid rounded-circle" alt="Avatar" style={{width: '60px', height: '60px'}} />
                    </div>
                    {/* Center Section (Text) */}
                    <div className="col-md-8">
                      <p>Your text goes here. Lorem ipsum dolor sit amet.</p>
                      {/* Clock Icon */}
                      <div className="mt-3">
                        <i className="far fa-clock" />
                        <span className="ml-1">3 mins ago</span>
                      </div>
                      {/* Vote, , and share Icons */}
                      <div className="d-flex justify-content-start mt-3">
                        <div className="mr-4">
                          <i className="fas fa-heart" />
                          <span className="ml-1">Vote</span>
                          <span className="ml-1">10</span>
                        </div>
                        <div>
                          <i className="fas fa-share" />
                          <span className="ml-1">Share</span>
                          <span className="ml-1">20</span>
                        </div>
                      </div>                
                      {/* Buttons */}
                      <div className="mt-3">
                        <button type="button" className="btn btn-success">Work</button>
                        <button type="button" className="btn btn-success ml-2">Php</button>
                        <button type="button" className="btn btn-success ml-2">Design</button>
                      </div>
                      {/* Text and Comments */}
                      <div className="mt-3">
                        <p>"Lorem ipsum dolor sit amet, consectetur
                          adipiscing elit. Sed do eiusmod tempor
                          incididunt ut labore et dolore magna aliqua.
                          Ut enim ad minim veniam, quis nostrud exercitation ullamco
                          laboris nisi ut aliquip ex ea commodo consequat. 
                          Duis aute irure dolor in reprehenderit in voluptate velit
                          esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                          occaecat cupidatat non proident, sunt in culpa qui officia 
                          deserunt mollit anim id est laborum</p>
                        <strong>03 Comments</strong>
                      </div>
                      {/* Horizontal Line */}
                      <hr className="my-4" />
                      <div className="mt-3">
                        <div className="d-flex flex-column align-items-start">
                          <strong>Atta Adwoa</strong>
                          <div className="d-flex align-items-center">
                            <i className="far fa-clock" />
                            <span className="ml-1">3 mins ago</span>
                          </div>
                          <p>Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.
                          </p>
                        </div>
                      </div>
                      {/* Horizontal Line */}
                      <hr className="my-3" />
                      <div className="mt-3">
                        <div className="d-flex flex-column align-items-start">
                          <strong>Atta Adwoa</strong>
                          <div className="d-flex align-items-center">
                            <i className="far fa-clock" />
                            <span className="ml-1">3 mins ago</span>
                          </div>
                          <p>Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">03 comments</h5>
                    <div className="avatar">
                      <img src="img/avatar.webp" alt="Avatar" className="avatar-img" style={{width: '50px', height: '50px'}} />
                    </div>
                    <textarea className="form-control ml-5" rows={3} style={{width: '92%', height: '50%'}} placeholder="Write your comment here..." defaultValue={""} />
                    <button type="button" className="btn btn-primary ml-5 mt-3">Post Answer</button>
                  </div>
                </div>
              </div>
              <div className="card mt-3">
                <div className="card-body d-flex justify-content-between">
                  <button type="button" className="btn btn-primary">Preview</button>
                  <button type="button" className="btn btn-primary">Next</button>
                </div>
              </div>
            </div>
            {/* Right Column with a smaller width */}
            <div className="col-lg-4">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <i className="fa fa-heart text-primary" /> <br /><span className="badge ">104</span>
                    </div>
                    <div className="col">
                      <i className="fa fa-bell text-danger" /><br /><span className="badge ">542</span>
                    </div>
                    <div className="col">
                      <i className="fa fa-share text-info" /> <br /><span className="badge ">34</span>
                    </div>
                    <div className="col">
                      <i className="fa fa-eye text-success" /> <br /><span className="badge ">2032</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: '#fff'}}>
                    {/* Heading on the left */}
                    <h5 className="mb-0">Top User of the Week</h5>
                    {/* Three dots on the right */}
                    <span>⋮</span>
                  </div>
                  <div className="card-body">
                    {/* Avatar, Name, and Interest */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      {/* Avatar on the left */}
                      <img src="img/avatar.webp" alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="d-flex justify-content-end align-items-center">
                        {/* Badge/crest icon for popular */}
                        <i className="fas fa-certificate text-warning mr-1" />
                        {/* Number */}
                        <p className="mb-0 ml-1">1185</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-3 mb-4">
                      {/* Avatar on the left */}
                      <img src="img/avatar.webp" alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="d-flex justify-content-end align-items-center mt-3">
                        {/* Badge/crest icon for popular */}
                        <i className="fas fa-certificate text-warning mr-1" />
                        {/* Number */}
                        <p className="mb-0 ml-1">1185</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-3 mb-4">
                      {/* Avatar on the left */}
                      <img src="img/avatar.webp" alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="d-flex justify-content-end align-items-center mt-3">
                        {/* Badge/crest icon for popular */}
                        <i className="fas fa-certificate text-warning mr-1" />
                        {/* Number */}
                        <p className="mb-0 ml-1">1185</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-3 mb-4">
                      {/* Avatar on the left */}
                      <img src="img/avatar.webp" alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="d-flex justify-content-end align-items-center mt-3">
                        {/* Badge/crest icon for popular */}
                        <i className="fas fa-certificate text-warning mr-1" />
                        {/* Number */}
                        <p className="mb-0 ml-1">1185</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-3">
                      {/* Avatar on the left */}
                      <img src="img/avatar.webp" alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="d-flex justify-content-end align-items-center mt-3">
                        {/* Badge/crest icon for popular */}
                        <i className="fas fa-certificate text-warning mr-1" />
                        {/* Number */}
                        <p className="mb-0 ml-1">1185</p>
                      </div>
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

export default ForumPostView;

import avatar from '../Images/avatar.webp'
import coverPhoto from '../Images/coverPhoto.jpg'
// import React, { useState, useEffect } from 'react';
// import $ from 'jquery';
import 'bootstrap'; 


function Messages() {
    return (
        <>
        <div>
          <div className="container mt-5">
            <div className="row no-gutters">
              {/* Left Section */}
              <div className="col-md-4">
                {/* Add content for the left section */}
                <div className="card mb-3">
                  <div className="card-header d-flex justify-content-between align-items-center bg-white">
                    <div>
                      <h5 className="mb-0">Message</h5>
                    </div>
                    <div>
                      <i className="fas fa-cog" /> {/* Settings icon */}
                      <i className="fas fa-ellipsis-v" /> {/* Three horizontal dots icon */}
                    </div>
                  </div>
                  <div className="card-body">
                    {/* Your message content goes here */}
                    <div className="media mb-2">
                      <img src={avatar} className="mr-3 avatar-img" alt="User Avatar" />
                      <div className="media-body">
                        <h6 className="mt-0">John Doe</h6>
                        <p>Hey, how are you doing?</p>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <small className="text-muted">12:30 PM</small>
                        <span className="badge badge-primary">3</span>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="media mb-2">
                      <img src={avatar} className="mr-3 avatar-img" alt="User Avatar" />
                      <div className="media-body">
                        <h6 className="mt-0">John Doe</h6>
                        <p>Hey, how are you doing?</p>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <small className="text-muted">12:30 PM</small>
                        <span className="badge badge-primary">1</span>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="media mb-2">
                      <img src={avatar} className="mr-3 avatar-img" alt="User Avatar" />
                      <div className="media-body">
                        <h6 className="mt-0">John Doe</h6>
                        <p>Hey, how are you doing?</p>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <small className="text-muted">12:30 PM</small>
                        <span className="badge badge-primary">10</span>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="media mb-2">
                      <img src={avatar} className="mr-3 avatar-img" alt="User Avatar" />
                      <div className="media-body">
                        <h6 className="mt-0">John Doe</h6>
                        <p>Hey, how are you doing?</p>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <small className="text-muted">12:30 PM</small>
                        <span className="badge badge-primary">1</span>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="media mb-2">
                      <img src={avatar} className="mr-3 avatar-img" alt="User Avatar" />
                      <div className="media-body">
                        <h6 className="mt-0">John Doe</h6>
                        <p>Hey, how are you doing?</p>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <small className="text-muted">12:30 PM</small>
                        <span className="badge badge-primary">1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Section */}
              <div className="col-md-8">
                <div className="card">
                  {/* Chat Header */}
                  <div className="card-header d-flex justify-content-between align-items-center bg-light p-3">
                    {/* Center: User's information */}
                    <div className="d-flex align-items-center">
                      {/* User's avatar */}
                      <img src={avatar} alt="User Avatar" className="avatar-img mr-2" style={{width: '40px', height: '40px'}} />
                      {/* User's name and online status */}
                      <div>
                        <h6 className="mb-0">John Doe</h6>
                        <small className="text-success">Online</small>
                      </div>
                    </div>
                    {/* Right side: Three vertical dots icon */}
                    <i className="fas fa-ellipsis-v" />
                  </div>
                  {/* Chat Body */}
                  <div className="card-body">
                    {/* Chat Window */}
                    <div className="row" style={{maxHeight: '85vh'}}>
                      <div className="col-md-8">
                        <div className="d-flex align-items-center" style={{minHeight: '52vh'}}>
                          {/* Avatar on the left side */}
                          <img src={avatar} alt="User Avatar" className="avatar-img mr-2" />
                          {/* Chat messages container */}
                          <div className="chat-messages">
                            {/* User's messages */}
                            <div className="message my-message">
                              <p>How are you doing?</p>
                            </div>
                            <p className="text-muted" id="messageTime">20 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      {/* Right Column */}
                      <div className="col-md-4">
                        <div className="d-flex align-items-center justify-content-end" style={{minHeight: '45vh'}}>
                          {/* Another Chat messages container */}
                          <div className="chat-messages">
                            {/* Another user's messages */}
                            <div className="message other-message">
                              <p>Not much, just working on some stuff.</p>
                            </div>
                            <p className="text-muted" id="messageTime">Sat, Aug 24, 1:10pm</p>
                          </div>
                          {/* Right Avatar */}
                          <img src={coverPhoto} alt="Another User Avatar" className="avatar-img ml-2" />
                        </div>
                      </div>
                    </div>
                    {/* Input Field and Send Button */}
                    <div className="input-group mt-3">
                      <input type="text" className="form-control" placeholder="Type your message..." />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="button">Send</button>
                      </div>
                      {/* Emoji Icon with Emoji Picker */}
                      <div className="input-group-append">
                        <button className="btn btn-secondary emoji-picker-btn" type="button">
                          <i className="far fa-smile" />
                        </button>
                      </div>
                      {/* Camera Icon */}
                      <div className="input-group-append">
                        <button className="btn btn-secondary" type="button" id="cameraBtn">
                          <i className="fas fa-camera" />
                        </button>
                      </div>
                      {/* File Clipper Icon */}
                      <div className="input-group-append">
                        <button className="btn btn-secondary" type="button" id="fileClipperBtn">
                          <i className="fas fa-paperclip" />
                        </button>
                      </div>
                    </div>
                    {/* Add this modal HTML at the end of your body tag */}
                    <div className="modal fade" id="cameraModal" tabIndex={-1} role="dialog" aria-labelledby="cameraModalLabel" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="cameraModalLabel">Select a Photo</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            {/* Your camera/photo selection content goes here */}
                            {/* For simplicity, let's just show a message */}
                            <p>Select a photo using your camera or from the gallery.</p>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            {/* You can add a button for the user to submit the selected photo */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          {/* <script>
            function toggleText() {'{'}
            $('#longText').toggleClass('truncated-text');
            $('#readMoreLink').text(function(i, text){'{'}
            return text === "Read More" ? "Read Less" : "Read More";
            {'}'});
            {'}'}
            setInterval(function() {'{'}
            $('#cardSlider').carousel('next');
            {'}'}, 5000);
            function toggleViewMore() {'{'}
            const viewMoreContainer = document.getElementById('viewMoreContainer');
            viewMoreContainer.classList.toggle('view-more-content-expanded');
            {'}'}
            document.getElementById('commentForm').addEventListener('submit', function (event) {'{'}
            event.preventDefault();
            // Get the comment input value
            var comment = document.getElementById('commentInput').value;
            // Add the new comment to the comments list
            var commentItem = document.createElement('div');
            commentItem.className = 'mb-2';
            commentItem.textContent = 'User: ' + comment;
            document.getElementById('existingComments').appendChild(commentItem);
            // Clear the comment input
            document.getElementById('commentInput').value = '';
            {'}'});
            // Function to toggle comment dropdown
            function toggleCommentDropdown() {'{'}
            $('#commentDropdown').dropdown('toggle');
            {'}'}
            // Function to handle comment form submission
            document.getElementById('commentForm').addEventListener('submit', function (event) {'{'}
            event.preventDefault();
            // Get the comment input value
            var comment = document.getElementById('commentInput').value;
            // Add the new comment to the comments list
            var commentItem = document.createElement('div');
            commentItem.className = 'mb-2';
            commentItem.textContent = 'User: ' + comment;
            document.getElementById('existingComments').appendChild(commentItem);
            // Clear the comment input
            document.getElementById('commentInput').value = '';
            // Close the comment dropdown
            toggleCommentDropdown();
            {'}'});
            document.getElementById('cameraBtn').addEventListener('click', function () {'{'}
            // Your logic to handle the camera icon click (e.g., open a modal for photo selection)
            console.log('Camera button clicked');
            // You can add additional logic here to perform specific actions when the camera button is clicked
            {'}'});
            // Handle File Clipper Button Click
            document.getElementById('fileClipperBtn').addEventListener('click', function () {'{'}
            // Your logic to handle the file clipper icon click (e.g., open a file selection dialog)
            console.log('File clipper button clicked');
            {'}'});
            // Enable Popover for Emoji Icon
            $(function () {'{'}
            $('[data-toggle="popover"]').popover()
            {'}'});
            // Initialize Emoji Picker
            $(document).ready(function () {'{'}
            $('.emoji-picker-btn').emojiPicker({'{'}
            width: '300px',
            height: '200px',
            button: false
            {'}'});
            {'}'});
          </script> */}
        
          </>
          );
}

export default Messages;

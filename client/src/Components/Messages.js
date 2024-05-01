import React, { useState, useEffect } from 'react';
import 'bootstrap';
import avatar from '../Images/avatar.webp';
import coverPhoto from '../Images/coverPhoto.jpg';
import axios from 'axios';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [profileData, setProfileData] = useState({ profileImagePath: '',firstName: '',
  lastName: '',
  userName: '',
  headline: '', });

  // Define currentUser statically for demonstration purposes
  const currentUser = { name: "John Doe" };

  useEffect(() => {
    fetch('/api/messages')
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching messages:', error));
  }, []);

  const handleMessageSend = () => {
    if (newMessage.trim() === '') {
      return;
    }
  
    const messageToSend = {
      content: newMessage.trim(),
      sender: currentUser.name,
      timestamp: new Date().toISOString(),
    };
  
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageToSend),
    })
    .then(response => response.json())
    .then(data => {
      setMessages(messages => [...messages, data]);
      setNewMessage('');
    })
    .catch(error => console.error("Sending message failed", error));
  };
  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/user/profile', {
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

// Construct the image URL
const imageUrl = `http://localhost:3001/${imagePath}`;
console.log(imageUrl)
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
                      {profileData.profileImagePath ? (
                      <img src={imageUrl} alt="User Avatar" className="avatar-img mr-2" style={{width: '40px', height: '40px'}} />
                    ):(
                      <img src={avatar} alt="User Avatar" className="avatar-img mr-2" style={{width: '40px', height: '40px'}} />
                    )}
                      {/* User's name and online status */}
                      <div>
                        <h6 className="mb-0">{profileData.firstName} {profileData.lastName}</h6>
                        <small className="text-success">Online</small>
                      </div>
                    </div>
                    {/* Right side: Three vertical dots icon */}
                    <i className="fas fa-ellipsis-v" />
                  </div>
                  {/* Chat Body */}
                  <div className="card-body">
                    {/* Chat Window */}
                    <div className="card-body">
            {/* Chat Window */}
            <div className="row" style={{ maxHeight: '85vh' }}>
              {/* Left Column */}
              <div className="col-md-8">
                <div className="d-flex align-items-center" style={{ minHeight: '52vh' }}>
                  {/* Avatar on the left side */}
                  <img src={avatar} alt="User Avatar" className="avatar-img mr-2" />
                  {/* Chat messages container */}
                  <div className="chat-messages">
                    {/* User's messages */}
                    {messages.map((message, index) => (
                      <div className="message my-message" key={index}>
                        <p>{message.content}</p>
                      </div>
                    ))}
                    <p className="text-muted" id="messageTime">20 minutes ago</p>
                  </div>
                </div>
              </div>
                      {/* Right Column */}
                      <div className="col-md-4">
                <div className="d-flex align-items-center justify-content-end" style={{ minHeight: '45vh' }}>
                  {/* Another Chat messages container */}
                  <div className="chat-messages">
                    {/* Another user's messages */}
                    {messages.map((message, index) => (
                      <div className="message other-message" key={index}>
                        <p>{message.content}</p>
                      </div>
                    ))}
                    <p className="text-muted" id="messageTime">Sat, Aug 24, 1:10pm</p>
                  </div>
                  {/* Right Avatar */}
                  <img src={coverPhoto} alt="Another User Avatar" className="avatar-img ml-2" />
                </div>
              </div>
            </div>
                    {/* Input Field and Send Button */}
                    <div className="input-group mt-3">
                      <input type="text" className="form-control"
                       placeholder="Type your message..."
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)} />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="button" onClick={handleMessageSend}>Send</button>
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
          </div>
          

            </>
          );
          }

export default Messages;

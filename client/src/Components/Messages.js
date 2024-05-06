import '../App.css';
import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap';
import avatar from '../Images/avatar.webp';
// import coverPhoto from '../Images/coverPhoto.jpg';

import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Messages() {
  const { friendId } = useParams();
  const [profileData, setProfileData] = useState({ profileImagePath: '', firstName: '', lastName: '', userName: '', headline: '' });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
 
  useEffect(() => {
    const messagesContainer = document.querySelector('.chat-messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}, [messages]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchFriends(token);
      fetchUserData(token);
      if (friendId) {
        fetchMessages(friendId, token);
      }
    }
  }, [friendId]); // Fetch messages when friendId changes

  const fetchFriends = async (token) => {
    try {
      const response = await axios.get('http://localhost:3001/api/friends', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchMessages = async (friendId, token) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/messages/user/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:3001/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setProfileData({
          _id: response.data._id,
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

  const handleMessageSend = useCallback(async () => {
    if (!newMessage.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/messages', {
        content: newMessage,
        receiver: friendId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(currentMessages => [...currentMessages, response.data]);
      setNewMessage('');
      document.getElementById('messageInput').focus();
    } catch (error) {
      console.error("Sending message failed", error);
    }
  }, [newMessage, friendId]);

  const navigateToFriend = (id) => {
    navigate(`/messages/${id}`);
  };

  const imagePath = profileData.profileImagePath.replace(/\\/g, '/');
  const imageUrl = `http://localhost:3001/${imagePath}`;

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
                  {friends.map(friend => (
                        <div key={friend._id} onClick={() => navigateToFriend(friend._id)} className="media mb-2">
                            <img src={friend.profile.profileImagePath || avatar} className="mr-3 avatar-img" alt="User Avatar" />
                            <div className="media-body">
                                <h6 className="mt-0">{friend.firstName} {friend.lastName}</h6>
                                <p>{friend.content}</p>
                            </div>
                            <div className="d-flex flex-column align-items-end">
                                <small className="text-muted">{new Date(friend.timestamp).toLocaleTimeString()}</small>
                                {/* Display badge if needed */}
                                <span className="badge badge-primary">3</span>
                            </div>
                        </div>
                    ))}
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
                      <div className="col-md-8">
                      <div className="row" style={{ maxHeight: '85vh' }}>
                        {/* Messages Container */}
                          <div className="col-md-12">
                    <div className="d-flex flex-column">
                      {/* Loop over messages */}
                      {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender._id === profileData._id ? 'my-message' : 'other-message'}`}>
                          <div className="d-flex justify-content-between">
                            {/* Display sender's avatar and name if the message is from the sender */}
                            {message.sender._id === profileData._id && (
                              <>
                                <img src={message.sender.profileImagePath || avatar} alt="Avatar" className="avatar-img" />
                                <div>
                                  <p className="text-right">{message.content}</p>
                                  <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
                                </div>
                              </>
                            )}
                            {/* Display receiver's avatar and name if the message is from the receiver */}
                            {message.sender._id !== profileData._id && (
                              <>
                                <img src={message.receiver.profileImagePath || avatar} alt="Avatar" className="avatar-img" />
                                <div>
                                  <p>{message.content}</p>
                                  <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                      </div>
              </div>
            
                    {/* Input Field and Send Button */}
                    <div className="input-group mt-3">
                    {/* {messages.map((message, index) => (
                        <p key={index}>{message.sender.firstName}: {message.content}</p>
                    ))} */}


                    <input type="text" className="form-control" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} id="messageInput" />
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
          

            </>
          );
          }

export default Messages;

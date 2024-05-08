import '../App.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import 'bootstrap';
import EmojiPicker from 'emoji-picker-react';
import avatar from '../Images/avatar.webp';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Messages() {
  const { friendId } = useParams();
  const [profileData, setProfileData] = useState({ profileImagePath: '', firstName: '', lastName: '', userName: '', headline: '' });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
 
  const onEmojiClick = (emojiObject) => {
    console.log(emojiObject); // Ensure you are now logging the emoji data
    if (emojiObject && emojiObject.emoji) {
        setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
    }
};

// Close emoji picker if clicked outside
useEffect(() => {
  function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false);
      }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
      document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


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

  // Function to handle the image change event
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Set the image file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
    }
  };
// Function to send text messages
const sendTextMessage = useCallback(async (content) => {
  try {
    const response = await axios.post('http://localhost:3001/api/messages', {
      content: content,
      receiver: friendId
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setMessages(currentMessages => [...currentMessages, response.data]);
    setNewMessage('');
  } catch (error) {
    console.error("Sending message failed", error);
  }
}, [friendId]);
  // General send function that handles both images and text
  const handleMessageSend = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile); 
      formData.append('receiver', friendId);
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }
      try {
        const uploadResponse = await axios.post('http://localhost:3001/upload/message-image', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (uploadResponse.data) {
          const imageUrl = uploadResponse.data.imageUrl;
          const content = `${imageUrl}`;
          console.log(content)
          await sendTextMessage(content); // Send the URL in a message
          setImageFile(null);
          setImagePreview('');
        }
      } catch (error) {
        console.error("Uploading image failed", error);
      }
    } else if (newMessage.trim()) {
      await sendTextMessage(newMessage);
    }
  }, [newMessage, imageFile, friendId, sendTextMessage]);

  
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
                      <div className="col-md-12 chat-messages">
                      <div className="row ">
                      {/* Loop over messages */}
                      {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender._id === profileData._id ? 'my-message' : 'other-message'}`}>
                          {/* <div className="d-flex justify-content-between"> */}
                            {/* Display sender's avatar and name if the message is from the sender */}
                            {message.sender._id === profileData._id && (
                              <>
                                <div className="message-text">
                                  {message.imageUrl && (
                                      <img src={`http://localhost:3001${message.imageUrl}`} alt="Sent" style={{ width: '100px', height: '100px' }} />
                                  )}
                                  <p className="content">{message.content}</p>
                                  <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
                                </div>
                                <img src={message.sender.profileImagePath || avatar} alt="Avatar" className="avatar-img" />
                              </>
                            )}
                            {/* Display receiver's avatar and name if the message is from the receiver */}
                            {message.sender._id !== profileData._id && (
                              <>
                                <img src={message.receiver.profileImagePath || avatar} alt="Avatar" className="avatar-img" />
                                <div className="message-text">
                                {message.imageUrl && (
                                      <img src={`http://localhost:3001${message.imageUrl}`} alt="Sent" style={{ width: '100px', height: '100px' }} />
                                  )}
                                  <p >{message.content}</p>
                                  <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
                                </div>
                              </>
                            )}
                          
                          {/* </div> */}
                        </div>
                      ))}
                      </div>
                    </div>
            
                    {/* Input Field and Send Button */}
                    {imagePreview && (
                        <div style={{ margin: '10px 0' }}>
                          <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px' }} />
                        </div>
                      )}
                   <div className="input-group mt-3">
                    <input type="text" className="form-control" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} id="messageInput" />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="button" onClick={handleMessageSend}>Send</button>
                      </div>
                      {/* Emoji Icon with Emoji Picker */}
                      <div className="input-group-append">
                        <button className="btn btn-secondary emoji-picker-btn" type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                          <i className="far fa-smile" />
                        </button>
                      </div>
                                  {showEmojiPicker && (
                            <div ref={emojiPickerRef} style={{ position: 'absolute', bottom: '50px', right: '50px' }}>
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>
                        )}
                      {/* Camera Icon */}
                      <div className="input-group-append">
                      <button className="btn btn-secondary" type="button" id="cameraBtn" onClick={() => fileInputRef.current.click()}>
                          <i className="fas fa-camera" />
                        </button>
                      </div>
                      {/* Image Upload and Preview */}
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                      />

                      {/* File Clipper Icon */}
                      <div className="input-group-append">
                        <button className="btn btn-secondary" type="button" id="fileClipperBtn">
                          <i className="fas fa-paperclip" />
                        </button>
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

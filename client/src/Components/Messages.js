import axios from 'axios';
import 'bootstrap';
import EmojiPicker from 'emoji-picker-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import avatar from '../Images/avatar.webp';
import Resumable from 'resumablejs';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
// import io from 'socket.io-client';

function Messages() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ profileImagePath: '', firstName: '', lastName: '', userName: '', headline: '' });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [filePreview, setFilePreview] = useState('');
  const fileInputRef = useRef(null);
  const fileUploadRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const emojiPickerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [friends, setFriends] = useState([]);
  const [videoPreview, setVideoPreview] = useState('');
  const [pdfFile, setPdfFile] = useState();

  
//   useEffect(() => {
//     const socket = io('http://localhost:3001', {
//     reconnection: true,
//     reconnectionDelay: 1000,
//     reconnectionAttempts: 10
// });

  
//     socket.on('connect', () => {
//       console.log('Connected to socket server');
//     });
  
//     socket.on('message', message => {
//       setMessages(prevMessages => [...prevMessages, message]);
//     });
  
//     socket.on('disconnect', () => {
//       console.log('Disconnected from socket server');
//     });
  
//     return () => socket.disconnect();
//   }, []);
 
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
// Function to send text messages
const sendTextMessage = useCallback(async (content, imageUrl, isImage = false) => {
  const senderId = localStorage.getItem('userId');
  const optimisticMessage = {
    content,
    sender: { _id: senderId }, // Assuming you have access to the user's ID here
    receiver: friendId,
    imageUrl: isImage ? content : null,
    timestamp: new Date(),
    isOptimistic: true 
  };

  // Optimistically add the message to the chat
  setMessages(currentMessages => [...currentMessages, optimisticMessage]);

  try {
    const payload = {
      content: content,
      imageUrl: isImage ? imageUrl : null,
      receiver: friendId,
      isImage
    };
    const response = await axios.post('http://localhost:3001/api/messages', payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    // Replace the optimistic message with the actual response from the server
    setMessages(currentMessages => currentMessages.map(msg =>
      msg.timestamp === optimisticMessage.timestamp ? response.data : msg
    ));
  } catch (error) {
    console.error("Sending message failed", error);
    // Optionally remove the optimistic message if the send fails
    setMessages(currentMessages => currentMessages.filter(msg => msg.timestamp !== optimisticMessage.timestamp));
  }
}, [friendId, setMessages]);


  // General send function that handles both images and text
  const handleImageUpload = async (file, receiverId) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('receiver', receiverId);
  
    try {
      const response = await axios.post('http://localhost:3001/upload/message-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(percentCompleted); // You can use this percentage to update a progress bar
        }
      });
      return response.data; // contains the URL and potentially other response data
    } catch (error) {
      console.error("Uploading image failed", error);
      return null;
    }
  };
  
  // Modify your send function
  const handleMessageSend = useCallback(async () => {
    if (!imageFile && !newMessage.trim()) {
      return; // Prevent sending empty messages
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    
    let imageUrl = null;
    if (imageFile) {
      const uploadData = await handleImageUpload(imageFile, friendId);
      imageUrl = uploadData ? uploadData.imageUrl : null;
    }
  
    // If there's text or an image URL, send the message
    if (newMessage.trim() || imageUrl) {
      await sendTextMessage(newMessage, imageUrl, !!imageUrl);
      setImageFile(null);
      setImagePreview('');
      setNewMessage('');
    }
  }, [newMessage, imageFile, friendId, sendTextMessage]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token && friendId) {
        try {
          const [userRes, messagesRes] = await Promise.all([
            axios.get(`http://localhost:3001/user/profile`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`http://localhost:3001/api/messages/user/${friendId}`, { headers: { Authorization: `Bearer ${token}` } })
          ]);
          setProfileData(userRes.data);
          setMessages(messagesRes.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [friendId]);
  
  useEffect(() => {
    if (fileUploadRef.current) {
      setupResumable();
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // setFile(file); // Set file state if needed for further operations
    const fileType = file.type.split('/')[0];
    
    switch (fileType) {
        case 'image':
            previewFile(file, 'image');
            break;
        case 'video':
            previewFile(file, 'video');
            break;
        case 'application':
            setFilePreview(`Document ready to send: ${file.name}`);
            break;
        default:
            setFilePreview(`File ready to send: ${file.name}`);
            break;
    }
};


const previewFile = (file, type) => {
  const reader = new FileReader();
  reader.onloadend = () => {
      if (type === 'image') {
          setImagePreview(reader.result);
      } else if (type === 'video') {
          setVideoPreview(reader.result);
      } else if (type === 'application' && file.type.includes('pdf')) {
          setPdfFile(reader.result); // Set the PDF file for viewing
      }
  };
  reader.readAsDataURL(file);
};

// Example implementation for displaying upload progress
function setupResumable() {
  const token = localStorage.getItem('token');
    var resumable = new Resumable({
        target: 'http://localhost:3001/chunk-upload',
        query: { upload_token: 'your_token_here' },
        headers: {Authorization: `Bearer ${token}`,}, // Send token as an Authorization header
        fileInput: fileUploadRef.current,
        chunkSize: 1*1024*1024, // 1MB chunks
        simultaneousUploads: 4,
        testChunks: false,
        throttleProgressCallbacks: 1,
    });

    resumable.on('fileAdded', function(file, event) {
        console.log('File added:', file);
        resumable.upload();
    });

    resumable.on('fileSuccess', function(file, message) {
        console.log('File upload success:', file, message);
    });

    resumable.on('fileError', function(file, message) {
        console.log('File upload error:', file, message);
    });

    resumable.on('fileProgress', function(file) {
        console.log('File progress:', file, resumable.progress());
        // Update a progress bar or similar here
    });
}



  
  const navigateToFriend = (id) => {
    navigate(`/messages/${id}`);
  };

 const imagePath = profileData.profileImagePath?.replace(/\\/g, '/');
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
                                  {filePreview && (
                                    <div style={{ margin: '10px 0' }}>
                                        <p>File ready to send: {filePreview}</p>
                                    </div>
                                )}
                                 {videoPreview && (
                                    <video src={videoPreview} controls style={{ width: '100%', maxHeight: '300px' }}></video>
                                )}
                                {pdfFile && (
                                <div>
                                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
                                        <Viewer fileUrl={pdfFile} />
                                    </Worker>
                                </div>
                            )}
                      <p className="content" >{message.content}</p>
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
                                {filePreview && (
                                    <div style={{ margin: '10px 0' }}>
                                        <p>File ready to send: {filePreview}</p>
                                    </div>
                                )}
                                {pdfFile && (
                              <div>
                                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
                                      <Viewer fileUrl={pdfFile} />
                                  </Worker>
                              </div>
                          )}
                                 {videoPreview && (
                                    <video src={videoPreview} controls style={{ width: '100%', maxHeight: '300px' }}></video>
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
                        <button className="btn btn-secondary" type="button" id="fileClipperBtn" onClick={() => fileUploadRef.current.click()}>
                          <i className="fas fa-paperclip" />
                        </button>
                      </div>
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        ref={fileUploadRef}
                        name="fileInput"
                        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                      />
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

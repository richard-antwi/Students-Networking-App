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

function Messages() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ profileImagePath: '', firstName: '', lastName: '', userName: '', headline: '' });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [filePreview, setFilePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [pdfFile, setPdfFile] = useState();
  const [friends, setFriends] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const fileUploadRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchFriends(token);
      fetchUserData(token);
      if (friendId) {
        fetchMessages(friendId, token);
      }
    }
  }, [friendId]);

  useEffect(() => {
    const messagesContainer = document.querySelector('.chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

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
    if (fileUploadRef.current) {
      setupResumable();
    }
  }, []);

  const onEmojiClick = (emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
    }
  };

  const fetchFriends = async (token) => {
    try {
      const response = await axios.get('http://localhost:3001/api/friends', { headers: { Authorization: `Bearer ${token}` } });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:3001/user/profile', { headers: { Authorization: `Bearer ${token}` } });
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

  const fetchMessages = async (friendId, token) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/messages/user/${friendId}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      previewFile(file, fileType);
    }
  };

  const previewFile = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      switch (type) {
        case 'image':
          setImagePreview(reader.result);
          break;
        case 'video':
          setVideoPreview(reader.result);
          break;
        case 'application':
          if (file.type.includes('pdf')) {
            setPdfFile(reader.result);
          } else {
            setFilePreview(`File ready to send: ${file.name}`);
          }
          break;
        default:
          setFilePreview(`File ready to send: ${file.name}`);
          break;
      }
    };
    reader.readAsDataURL(file);
  };

  const sendTextMessage = useCallback(async (content, imageUrl, isImage = false) => {
    const senderId = localStorage.getItem('userId');
    const optimisticId = Date.now();
    const optimisticMessage = {
      id: optimisticId,
      content,
      sender: { _id: senderId },
      receiver: friendId,
      imageUrl: isImage ? content : null,
      timestamp: new Date(),
      isOptimistic: true
    };

    setMessages(currentMessages => [...currentMessages, optimisticMessage]);

    try {
      const payload = { content, imageUrl: isImage ? imageUrl : null, receiver: friendId, isImage };
      const response = await axios.post('http://localhost:3001/api/messages', payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setMessages(currentMessages => currentMessages.map(msg => msg.id === optimisticId ? response.data : msg));
    } catch (error) {
      console.error("Sending message failed", error);
      setMessages(currentMessages => currentMessages.filter(msg => msg.id !== optimisticId));
    }
  }, [friendId]);

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
          console.log(percentCompleted);
        }
      });
      return response.data;
    } catch (error) {
      console.error("Uploading image failed", error);
      return null;
    }
  };

  const handleMessageSend = useCallback(async () => {
    if (!imageFile && !newMessage.trim()) {
      console.warn("No content to send");
      return;
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

    if (newMessage.trim() || imageUrl) {
      await sendTextMessage(newMessage, imageUrl, !!imageUrl);
      setImageFile(null);
      setImagePreview('');
      setNewMessage('');
    }
  }, [newMessage, imageFile, friendId]);

  function setupResumable() {
    const token = localStorage.getItem('token');
    var resumable = new Resumable({
      target: 'http://localhost:3001/chunk-upload',
      query: { upload_token: 'your_token_here' },
      headers: { Authorization: `Bearer ${token}` },
      fileInput: fileUploadRef.current,
      chunkSize: 1 * 1024 * 1024,
      simultaneousUploads: 4,
      testChunks: false,
      throttleProgressCallbacks: 1,
    });

    resumable.on('fileAdded', function (file, event) {
      console.log('File added:', file);
      resumable.upload();
    });

    resumable.on('fileSuccess', function (file, message) {
      console.log('File upload success:', file, message);
    });

    resumable.on('fileError', function (file, message) {
      console.log('File upload error:', file, message);
    });

    resumable.on('fileProgress', function (file) {
      console.log('File progress:', file, resumable.progress());
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
              <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center bg-white">
                  <div>
                    <h5 className="mb-0">Message</h5>
                  </div>
                  <div>
                    <i className="fas fa-cog" />
                    <i className="fas fa-ellipsis-v" />
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
                <div className="card-header d-flex justify-content-between align-items-center bg-light p-3">
                  <div className="d-flex align-items-center">
                    {profileData.profileImagePath ? (
                      <img src={imageUrl} alt="User Avatar" className="avatar-img mr-2" style={{ width: '40px', height: '40px' }} />
                    ) : (
                        <img src={avatar} alt="User Avatar" className="avatar-img mr-2" style={{ width: '40px', height: '40px' }} />
                      )}
                    <div>
                      <h6 className="mb-0">{profileData.firstName} {profileData.lastName}</h6>
                      <small className="text-success">Online</small>
                    </div>
                  </div>
                  <i className="fas fa-ellipsis-v" />
                </div>
                <div className="card-body">
                  <div className="col-md-12 chat-messages">
                    <div className="row ">
                      {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender._id === profileData._id ? 'my-message' : 'other-message'}`}>
                          {message.sender._id === profileData._id && (
                            <div className="message-text">
                              {message.imageUrl && (
                                <img src={`http://localhost:3001${message.imageUrl}`} alt="Sent" style={{ width: '100px', height: '100px' }} />
                              )}
                              <p className="content">{message.content}</p>
                              <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
                            </div>
                          )}
                          {message.sender._id !== profileData._id && (
                            <div className="message-text">
                              {message.imageUrl && (
                                <img src={`http://localhost:3001${message.imageUrl}`} alt="Sent" style={{ width: '100px', height: '100px' }} />
                              )}
                              
                              <p>{message.content}</p>
                              <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
                            </div>
                          )}
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
                                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer fileUrl={pdfFile} />
                                  </Worker>
                                </div>
                              )}
                  <div className="input-group mt-3">
                    <input type="text" className="form-control" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button" onClick={handleMessageSend}>Send</button>
                    </div>
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
                    <div className="input-group-append">
                      <button className="btn btn-secondary" type="button" onClick={() => fileInputRef.current.click()}>
                        <i className="fas fa-camera" />
                      </button>
                    </div>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-secondary" type="button" onClick={() => fileUploadRef.current.click()}>
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

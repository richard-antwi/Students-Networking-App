import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import avatar from '../Images/avatar.webp';
import coverPhoto from '../Images/coverPhoto.jpg';
import img11 from '../Images/img11.png';


function MyProfile() {
  // const [coverImagePath] = useState(coverPhoto);
  const [modalShow, setModalShow] = useState(false);

    const handleOpenModal = () => setModalShow(true);
    const handleCloseModal = () => setModalShow(false);


  const navigate = useNavigate();

  const goToSettings = () => {
    navigate('/accountsettings'); 
  };

   // State to store input values
   const [formData, setFormData] = useState({
    firstName: '',  // Ensure initial value is not undefined
    lastName: '',
    additionalName: '',
    namePronunciation: '',
    headline: '',
    currentPosition: [], 
    industry: '',
    showSchool: false,
    education: [], // Make sure arrays are handled properly if they are used in inputs
    countryRegion: '',
    city: '',
    email: '', 
    phone: '',
    address: '',
  });
  
 
   const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
  
    // Handle inputs for arrays differently, e.g., currentPosition
    if (name.startsWith("currentPosition")) {
      // Example of handling array changes, needs custom logic based on your form
      const index = parseInt(name.split("-")[1]); // Assuming name="currentPosition-0"
      const field = name.split("-")[2]; // Assuming name="currentPosition-0-title"
  
      setFormData(prevFormData => ({
        ...prevFormData,
        currentPosition: prevFormData.currentPosition.map((item, idx) => {
          if (idx === index) {
            return { ...item, [field]: value };
          }
          return item;
        })
      }));
    } else {
      // Handle other inputs normally
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };
 
  const [positions, setPositions] = useState([{
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    currentlyWorkingHere: false
  }]);

  const addPosition = () => {
    const newPosition = {
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      currentlyWorkingHere: false
    };
    setPositions([...positions, newPosition]);
  };
  
  const removePosition = index => {
    const newPositions = [...positions];
    newPositions.splice(index, 1);
    setPositions(newPositions);
  };
  
  const handlePositionChange = (index, field, value) => {
    const newPositions = [...positions];
    newPositions[index] = {...newPositions[index], [field]: value};
    setPositions(newPositions);
  };
  
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      alert('You are not logged in. Redirecting to login page.');
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/user/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Profile updated:', response.data);
      setModalShow(false);
      alert('Profile updated successfully!');
    } catch (error) {
      if (error.response) {
        console.error('Failed to update profile:', error.response.data);
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error('Network error:', error.message);
        alert('Failed to update profile due to network error.');
      }
    }
  };
  

  const toggleViewMore = () => {
    console.log('View more clicked');
    // Add logic to expand or navigate, based on your application's needs
  };
  
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({ profileImagePath: '', profileCoverPath: '' });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        });
        setProfileData(prevData => ({ ...prevData, profileImagePath: response.data.filePath }));
        alert('Upload successful!');
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
      } finally {
        setUploading(false);
      }
    }
  };
  const handleCoverUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('coverImage', file);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3001/upload/cover', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        });
        setProfileData(prevData => ({ ...prevData, profileCoverPath: response.data.filePath }));
        alert('Upload successful!');
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
      } finally {
        setUploading(false);
      }
    }
  };


  const triggerFileSelectPopup = () => {
    document.getElementById('fileInput').click();
  };
  const triggerFileSelectPopupCover = () => {
    document.getElementById('fileInputCover').click();
  };

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/user/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data && response.data.profile) {
              const profileCoverPath = response.data.profile.coverImagePath
              ? `http://localhost:3001/${response.data.profile.coverImagePath.replace(/\\/g, '/')}`
              : null;
                setProfileData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    userName: response.data.userName,
                    headline: response.data.profile.headline,
                    profileImagePath: response.data.profile.profileImagePath,
                    profileCoverPath
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
const imageUrl = imagePath ? `http://localhost:3001/${imagePath}` : null;


 // FriendRequestsComponent starts here
 
 const [friendRequests, setFriendRequests] = useState([]);

 useEffect(() => {
  fetchFriendRequests();
}, []);

const fetchFriendRequests = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:3001/api/friend-requests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setFriendRequests(response.data);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
  }
};

const handleMessageFriend = (friendId) => {
  // Navigate to the messaging page with the friendId
  navigate(`/messages/${friendId}`);
  // If using modals, you might set state here to open a modal instead
};

const handleAccept = async (friendshipId) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/friendships/${friendshipId}/accept`);
    console.log(response.data);
    alert('Friend request accepted');
    // Remove the accepted request from state
    setFriendRequests(prevRequests => prevRequests.filter(request => request.id !== friendshipId));
  } catch (error) {
    console.error('Failed to accept friend request:', error);
    alert('Error accepting friend request');
  }
};const handleDecline = async (friendshipId) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/friendships/${friendshipId}/decline`);
    console.log(response.data);
    alert('Friend request declined');
    // Remove the declined request from state
    setFriendRequests(prevRequests => prevRequests.filter(request => request.id !== friendshipId));
  } catch (error) {
    console.error('Failed to decline friend request:', error);
    alert('Error declining friend request');
  }
};



      return (
        <>
       
        <div className="mt-3">
          {/* Profile Section with Cover Image */}
          <div className="cover-image" id="handleCoverChange" style={{ backgroundImage: `url(${profileData.profileCoverPath || coverPhoto})` }}>
          <input
                    type="file"
                    id="fileInputCover"
                    style={{ display: 'none' }}
                    onChange={handleCoverUpload}
                  />
          <div className="change-cover-btn mt-5" onClick={triggerFileSelectPopupCover}>
            <i className="fas fa-camera"  /> Change Cover Picture
          </div>
        </div>
        
          {/* Content below the cover image */}
          <div className="container-fluid">
            <div className="row">
              {/* Left Section */}
              <div className="col-md-3 bg-light ">
                <div className="card avatar-card">
                <div className="image-container d-flex justify-content-center align-items-center position-relative" style={{ height: '120px' }}>       
                              {/* Hidden File Input */}
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  {/* Camera Icon */}
                  <i className="fas fa-camera position-absolute"
                  onClick={triggerFileSelectPopup} 
                    style={{
                      left: '50%', // Centered, then moved half the width of the avatar to the left
                      transform: 'translate(-185%, -50%)', // Adjust position relative to the avatar
                      border: '1px solid rgb(245, 78, 78)', 
                      padding: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgb(245, 78, 78)', 
                      color: 'white',
                      cursor: 'pointer',
                      zIndex: 2, // Above the avatar
                    }}
                    
                  />
                  {uploading && <p>Uploading...</p>}

                  {/* Avatar Image */}
                 {/* Avatar Image */}
                  {profileData.profileImagePath ? (
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="card-img-top avatar-img"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        zIndex: 1, // Ensure the avatar is below the icons
                      }}
                    />
                  ) : (
                    <img
                      src={avatar} // Your default profile image path
                      alt="Default Profile"
                      className="card-img-top avatar-img"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        zIndex: 1, // Ensure the avatar is below the icons
                      }}
                    />
                  )}

                {/* Edit Icon */}
                <i className="fas fa-edit position-absolute" 
                  style={{
                    left: '50%', // Centered, then moved half the width of the avatar to the right
                    transform: 'translate(85%, -50%)', // Adjust position relative to the avatar
                    border: '1px solid rgb(50, 50, 200)', 
                    padding: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgb(50, 50, 254)', 
                    color: 'white',
                    cursor: 'pointer',
                    zIndex: 2, // Above the avatar
                  }}
                  onClick={handleOpenModal}
                />
              </div>


                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <p>Following</p>
                        <p>34</p>
                      </div>
                      <div>
                        <p>Followers</p>
                        <p>155</p>
                      </div>
                    </div>
                    <hr style={{marginTop: '10px', marginBottom: '10px'}} /> {/* Horizontal line */}
                    <div className="d-flex justify-content-between" style={{marginTop: '10px'}}> {/* Adjusted margin */}
                      <div>
                        <i className="fab fa-facebook text-primary" /> {/* Facebook Icon */}
                        <a href="https://www.facebook.com">Facebook</a> {/* Facebook Link */}
                      </div>
                      {/* Add similar code for other social media handles */}
                    </div>
                    <hr style={{marginTop: '10px', marginBottom: '10px'}} /> {/* Horizontal line */}
                    {/* YouTube Section */}
                    <div className="d-flex justify-content-between" style={{marginTop: '10px'}}>
                      <div>
                        <i className="fab fa-youtube text-danger" />
                        <a href="https://www.youtube.com">Youtube</a>
                      </div>
                    </div>
                    <hr style={{marginTop: '10px', marginBottom: '10px'}} />
                    {/* Twitter Section */}
                    <div className="d-flex justify-content-between" style={{marginTop: '10px'}}>
                      <div>
                        <i className="fab fa-twitter text-primary" />
                        <a href="https://www.twitter.com">Twitter</a>
                      </div>
                    </div>
                    <hr style={{marginTop: '10px', marginBottom: '10px'}} />
                    {/* Instagram Section */}
                    <div className="d-flex justify-content-between" style={{marginTop: '10px'}}>
                      <div>
                        <i className="fab fa-instagram" style={{color: '#9214e6'}} />
                        <a href="https://www.instagram.com">Instagram</a>
                      </div>
                    </div>
                    <hr style={{marginTop: '10px', marginBottom: '10px'}} />
                    {/* LinkedIn Section */}
                    <div className="d-flex justify-content-between" style={{marginTop: '10px'}}>
                      <div>
                        <i className="fab fa-linkedin text-primary" />
                        <a href="https://www.linkedin.com">LinkedIn</a>
                      </div>
                    </div>
                    <hr style={{marginTop: '10px', marginBottom: '10px'}} />
                    {/* GitHub Section */}
                    <div className="d-flex justify-content-between" style={{marginTop: '10px'}}>
                      <div>
                        <i className="fab fa-github" />
                        <a href="https://www.github.com">GitHub</a>
                      </div>
                    </div>
                    <hr style={{marginTop: '10px', marginBottom: '10px'}} />
                  </div>
                </div>
                <div className="card mt-5">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                <h5 className="mb-0">Friend Requests</h5>
                <span>⋮</span>
              </div>
              <div className="card-body">
              {friendRequests.map((request) => (
                   <div key={request._id} className="d-flex justify-content-between align-items-center my-3"> {/* Use `request._id` if available, otherwise index */}
                    <img   src={request.user?.profile.profileImagePath ? `http://localhost:3001/uploads/${request.user.profile.profileImagePath.replace(/\\/g, '/')}` : avatar}  alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{ width: '40px', height: '40px' }} />
                    <div className="text-left">
                      <h6 className="mb-1">{request.requester}</h6>
                      {/* <p className="mb-0 text-muted">{request.headline}</p> */}
                    </div>
                    <div className="text-right">
                      <button className="btn btn-success" onClick={() => handleAccept(request._id)}>Accept</button>
                      <button className="btn btn-danger" onClick={() => handleDecline(request._id)}>Decline</button>
                    </div>
                  </div>
                ))}
              </div>
              </div>
              </div>
              {/* Center Section */}
              <div className="col-md-6 bg-light ">
                {/* Left Section */}
                <h5 className="mt-3">{profileData.firstName} {profileData.lastName}</h5>
                <div className="mt-">
                  <p className="mb-2 d-inline">{profileData.headline}</p>
                  {/* Star Rating */}
                  <div className="rating d-inline ml-2">
                    <i className="fas fa-star" style={{color: 'rgb(158, 231, 74)'}} />
                    <i className="fas fa-star" style={{color: 'rgb(158, 231, 74)'}} />
                    <i className="fas fa-star" style={{color: 'rgb(158, 231, 74)'}} />
                    <i className="fas fa-star" style={{color: 'rgb(158, 231, 74)'}} />
                    <i className="far fa-star" style={{color: 'rgb(158, 231, 74)'}} />
                  </div>
                  {/* Link Status */}
                  <p className="link-status d-inline ml-2">
                    <Link to="/">Status</Link>
                  </p>
                </div>
                {/* Icons and Text */}
                <div className="d-flex mt-4">
                  <div className="text-center mr-5">
                    <i className="fas fa-feed fa-2x d-block" id="icon-color" />
                    <p className="d-inline-block" id="icon-color">Feed</p>
                  </div>
                  <div className="text-center mr-5">
                    <i className="fas fa-info-circle fa-2x d-block" id="icon-color-info" />
                    <p className="d-inline-block" id="icon-color-info">Info</p>
                  </div>
                  <div className="text-center mr-5">
                    <i className="fas fa-bookmark fa-2x d-block" id="icon-color" />
                    <p className="d-inline-block" id="icon-color">Jobs</p>
                  </div>
                  <div className="text-center mr-5">
                    <i className="fas fa-square-check fa-2x d-block" id="icon-color" />
                    <p className="d-inline-block" id="icon-color">Bids</p>
                  </div>
                  <div className="text-center mr-5">
                    <i className="fas fa-puzzle-piece fa-2x d-block" id="icon-color" />
                    <p className="d-inline-block" id="icon-color">Portfolio</p>
                  </div>
                  <div className="text-center mr-5">
                    <i className="fas fa-sun fa-2x d-block" id="icon-color" />
                    <p className="d-inline-block" id="icon-color">Reviews</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-wallet fa-2x d-block" id="icon-color" />
                    <p className="d-inline-block" id="icon-color">Payment</p>
                  </div>
                </div>
                {/* Post Section (Sample Post) */}
                <div className="card mt-3">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Avatar on the left */}
                      <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '50px', height: '50px'}} />
                      {/* User details */}
                      <div className="flex-grow-1 d-flex flex-column">
                        {/* Name */}
                        <div>
                          <h6 className="mb-0">John Doe</h6>
                        </div>
                        {/* Timer icon below the name */}
                        <div className="text-muted">
                          <i className="fa-solid fa-clock" /> 3 min ago
                        </div>
                      </div>
                      {/* Vertical three dots on the right */}
                      <div className="ml-auto">
                        <span>⋮</span>
                      </div>
                    </div>
                    {/* User interests and location */}
                    <div className="d-flex align-items-center mb-2">
                      {/* User interest icon and text */}
                      <div className="mr-2">
                        <i className="fas fa-graduation-cap text-danger" />
                      </div>
                      <div>
                        <p className="mb-0">Epic Developer</p>
                      </div>
                      {/* Location icon and text */}
                      <div className="ml-4 mr-2">
                        <i className="fas fa-map-marker-alt text-success" />
                      </div>
                      <div>
                        <p className="mb-0">Ghana</p>
                      </div>
                      {/* Favourite and message icons on the right */}
                      <div className="ml-auto">
                        <div className="mr-3">
                          <i className="far fa-bookmark text-white" style={{border: '#13a550 solid 10px', background: '#13a550', borderRadius: '3px'}} />
                          <i className="far fa-envelope text-white" style={{border: '#3e7df3 solid 10px', background: '#3e7df3', borderRadius: '3px'}} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <br />
                      <h5>
                        Senior Wordpress Developer
                      </h5>
                    </div>
                    <div className="ml-auto">
                      <span className="badge bg-success rounded-pill text-white p-2">Full Time</span>
                      {/* Price per hour */}
                      <span className="ml-2 ">$30/hr</span>
                    </div>
                    <br />
                    <div>
                      {/* User's dynamic content */}
                      <p className="mb-0 truncated-text" id="longText">
                        {/* User's lengthy text content here */}
                        {/* Assume this text is fetched dynamically from the database */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, libero vel consectetur luctus, odio nisi aliquam risus, vel volutpat orci felis at dolor Lorem ipsum dolor sit amet, 
                        consectetur adipiscing elit. Sed euismod, libero vel consectetur luctus, odio nisi aliquam risus, vel volutpat orci felis at dolor Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, libero vel consectetur luctus, odio nisi aliquam risus, vel volutpat orci felis at dolor...
                      </p>
                      {/* "Read More" link */}
                      <Link href="#" className="text-primary" id="readMoreLink" role="button" onClick="toggleText()">
                        Read More
                      </Link>
                    </div>
                    <div className="mb-3" style={{marginTop: '8px'}}>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>HTML</span>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>Python</span>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>C++</span>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>JavaScript</span>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Like Section */}
                      <div className="d-flex align-items-center">
                        <i className="fas fa-heart text-danger mr-2" />
                        <span className="mr-3">Like</span>
                        <div className="rounded-circle bg-secondary text-white px-2">10</div>
                      </div>
                      {/* Comment Section */}
                      <a data-toggle="collapse" href="#commentCollapse" role="button" aria-expanded="false" aria-controls="commentCollapse">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-comment text-primary mr-2" />
                          <span className="mr-3">Comment</span>
                          <div className="rounded-circle bg-secondary text-white px-2">5</div>
                        </div>
                      </a>
                      {/* View Section */}
                      <div className="d-flex align-items-center">
                        <i className="fas fa-eye text-success mr-2" />
                        <span>View</span>
                        <div className="rounded-circle bg-secondary text-white px-2">90</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Comment Collapse */}
                <div className="collapse mt-3" id="commentCollapse">
                  <div className="card card-body">
                    {/* Comment Form */}
                    <form id="commentForm" className="mb-2">
                      <div className="form-group">
                        <textarea id="commentInput" className="form-control" rows={2} placeholder="Type your comment..." defaultValue={""} />
                      </div>
                      <button type="submit" className="btn btn-primary btn-sm">Post</button>
                    </form>
                    {/* Existing Comments */}
                    <div id="existingComments" className="existing-comments">
                      {/* Comment items go here */}
                      <div className="mb-2">User 1: Great post!</div>
                      <div className="mb-2">User 2: Nice content!</div>
                      {/* Add more comment items as needed */}
                    </div>
                  </div>
                </div>
                {/* Post Section (Sample Post) */}
                <div className="card mt-3">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Avatar on the left */}
                      <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '50px', height: '50px'}} />
                      {/* User details */}
                      <div className="flex-grow-1 d-flex flex-column">
                        {/* Name */}
                        <div>
                          <h6 className="mb-0">John Doe</h6>
                        </div>
                        {/* Timer icon below the name */}
                        <div className="text-muted">
                          <i className="fa-solid fa-clock" /> 3 min ago
                        </div>
                      </div>
                      {/* Vertical three dots on the right */}
                      <div className="ml-auto">
                        <span>⋮</span>
                      </div>
                    </div>
                    {/* User interests and location */}
                    <div className="d-flex align-items-center mb-2">
                      {/* User interest icon and text */}
                      <div className="mr-2">
                        <i className="fas fa-graduation-cap text-danger" />
                      </div>
                      <div>
                        <p className="mb-0">Epic Developer</p>
                      </div>
                      {/* Location icon and text */}
                      <div className="ml-4 mr-2">
                        <i className="fas fa-map-marker-alt text-success" />
                      </div>
                      <div>
                        <p className="mb-0">Ghana</p>
                      </div>
                      {/* Favourite and message icons on the right */}
                      <div className="ml-auto">
                        <div className="mr-3">
                          <i className="far fa-bookmark text-white" style={{border: '#13a550 solid 10px', background: '#13a550', borderRadius: '3px'}} />
                          <i className="far fa-envelope text-white" style={{border: '#3e7df3 solid 10px', background: '#3e7df3', borderRadius: '3px'}} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <br />
                      <h5>
                        Senior Wordpress Developer
                      </h5>
                    </div>
                    <div className="ml-auto">
                      <span className="badge bg-success rounded-pill text-white p-2">Full Time</span>
                      {/* Price per hour */}
                      <span className="ml-2 ">$30/hr</span>
                    </div>
                    <br />
                    <div>
                      {/* User's dynamic content */}
                      <p className="mb-0 truncated-text" id="longText">
                        {/* User's lengthy text content here */}
                        {/* Assume this text is fetched dynamically from the database */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, libero vel consectetur luctus, odio nisi aliquam risus, vel volutpat orci felis at dolor Lorem ipsum dolor sit amet, 
                        consectetur adipiscing elit. Sed euismod, libero vel consectetur luctus, odio nisi aliquam risus, vel volutpat orci felis at dolor Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, libero vel consectetur luctus, odio nisi aliquam risus, vel volutpat orci felis at dolor...
                      </p>
                      {/* "Read More" link */}
                      <Link to="/" className="text-primary" id="readMoreLink" role="button" onClick="toggleText()">
                        Read More
                      </Link>
                    </div>
                    <div className="mb-3" style={{marginTop: '8px'}}>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>HTML</span>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>Python</span>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>C++</span>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>JavaScript</span>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Like Section */}
                      <div className="d-flex align-items-center">
                        <i className="fas fa-heart text-danger mr-2" />
                        <span className="mr-3">Like</span>
                        <div className="rounded-circle bg-secondary text-white px-2">10</div>
                      </div>
                      {/* Comment Section */}
                      <a data-toggle="collapse" href="#commentCollapse" role="button" aria-expanded="false" aria-controls="commentCollapse">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-comment text-primary mr-2" />
                          <span className="mr-3">Comment</span>
                          <div className="rounded-circle bg-secondary text-white px-2">5</div>
                        </div>
                      </a>
                      {/* View Section */}
                      <div className="d-flex align-items-center">
                        <i className="fas fa-eye text-success mr-2" />
                        <span>View</span>
                        <div className="rounded-circle bg-secondary text-white px-2">90</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Comment Collapse */}
                <div className="collapse mt-3" id="commentCollapse">
                  <div className="card card-body">
                    {/* Comment Form */}
                    <form id="commentForm" className="mb-2">
                      <div className="form-group">
                        <textarea id="commentInput" className="form-control" rows={2} placeholder="Type your comment..." defaultValue={""} />
                      </div>
                      <button type="submit" className="btn btn-primary btn-sm">Post</button>
                    </form>
                    {/* Existing Comments */}
                    <div id="existingComments" className="existing-comments">
                      {/* Comment items go here */}
                      <div className="mb-2">User 1: Great post!</div>
                      <div className="mb-2">User 2: Nice content!</div>
                      {/* Add more comment items as needed */}
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Section */}
              <div className="col-md-3 ">
                <div className="text-right mt-5">
                  <button type="button" className="btn btn-primary" onClick={goToSettings}>
                    <i className="fas fa-cog" /> Settings
                  </button>
                </div>
                {/* Card in the Center Section */}
                <div className="card mt-3">
                  <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: 'white'}}>
                    <div>
                      <h5 className="mb-0">Portfolio</h5>
                    </div>
                    <div>
                      <i className="fas fa-image" /> {/* Image icon */}
                    </div>
                  </div>
                  <div className="card-body">
                    {/* Your portfolio content goes here */}
                    <div className="row">
                      {/* Image 1 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image1" />
                      </div>
                      {/* Image 2 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image2" />
                      </div>
                      {/* Image 3 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image3" />
                      </div>
                      {/* Image 1 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image1" />
                      </div>
                      {/* Image 2 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image2" />
                      </div>
                      {/* Image 3 */}
                      <div className="col-md-4 mb-3">
                        <img src={img11} className="img-fluid custom-image" alt="Image3" />
                      </div>
                      {/* Image 1 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image1" />
                      </div>
                      {/* Image 2 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image2" />
                      </div>
                      {/* Image 3 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image3" />
                      </div>
                      {/* Image 1 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image1" />
                      </div>
                      {/* Image 2 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image2" />
                      </div>
                      {/* Image 3 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image3" />
                      </div>
                      {/* Image 1 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image1" />
                      </div>
                      {/* Image 2 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image2" />
                        
                      </div>
                      {/* Image 3 */}
                      <div className="col-md-4 mb-2">
                        <img src={img11} className="img-fluid custom-image" alt="Image3" />
                      </div>   
                    </div>
                  </div>
                </div>
                <div className="card mt-5">
                  <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: '#fff'}}>
                    <h5 className="mb-0">Friends</h5>
                    <span>⋮</span>
                  </div>
                  <div className="card-body">
                    {friendRequests.map(friend => (
                      <div key={friend._id} className="d-flex justify-content-between align-items-center my-3">
                        <img src={friend.avatar || avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                        <div className="text-left">
                          <h6 className="mb-1">{friend.firstName} {friend.lastName}</h6>
                          <p className="mb-0 text-muted">{friend.headline}</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => handleMessageFriend(friend._id)}>
                          Message
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card mt-5">
                  <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: '#fff'}}>
                    {/* Heading on the left */}
                    <h5 className="mb-0">Friends</h5>
                    {/* Three dots on the right */}
                    <span>⋮</span>
                  </div>
                  <div className="card-body">
                    {/* Avatar, Name, and Interest */}
                    <div className="d-flex justify-content-between align-items-center">
                      {/* Avatar on the left */}
                      <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="text-right" style={{border: '#bdbebd solid 1px', padding: '4px'}}>
                        <i className="fas fa-plus" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-3">
                      {/* Avatar on the left */}
                      <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="text-right" style={{border: '#bdbebd solid 1px', padding: '4px'}}>
                        <i className="fas fa-plus" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-3">
                      {/* Avatar on the left */}
                      <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="text-right" style={{border: '#bdbebd solid 1px', padding: '4px'}}>
                        <i className="fas fa-plus" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-3">
                      {/* Avatar on the left */}
                      <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="text-right" style={{border: '#bdbebd solid 1px', padding: '4px'}}>
                        <i className="fas fa-plus" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-3">
                      {/* Avatar on the left */}
                      <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="text-right" style={{border: '#bdbebd solid 1px', padding: '4px'}}>
                        <i className="fas fa-plus" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-3">
                      {/* Avatar on the left */}
                      <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                      {/* Name and Interest */}
                      <div className="text-left">
                        <h6 className="mb-1">John Doe</h6>
                        <p className="mb-0 text-muted">Web Developer</p>
                      </div>
                      {/* Icon at the extreme right */}
                      <div className="text-right" style={{border: '#bdbebd solid 1px', padding: '4px'}}>
                        <i className="fas fa-plus" />
                      </div>
                    </div>
                    {/* View More button */}
                    <div className="text-center mt-3">
                    
                    <span className="view-more-btn" onClick={toggleViewMore}>View More</span>

                    </div>
                  </div>
                </div>
              </div>
            </div>




             {/* Bootstrap Modal for User Profile update */}
            <div className={`modal ${modalShow ? 'show' : ''}`} tabIndex={-1} role="dialog" style={{ display: modalShow ? 'block' : 'none' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit intro</h5>
                <button type="button" onClick={handleCloseModal} className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
              <div className="modal-body">
                
                  <div className="form-group">
                    <label htmlFor="firstName">First name*</label>
                    <input type="text" className="form-control" 
                    id="firstName" placeholder="Richard"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last name*</label>
                    <input type="text" className="form-control" 
                    id="lastName" placeholder="Antwi" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="additionalName">Additional name</label>
                    <input type="text" className="form-control"
                     id="additionalName"
                     name="additionalName"
                    value={formData.additionalName}
                    onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="namePronunciation">Name pronunciation</label>
                    <input type="text" className="form-control" 
                    id="namePronunciation" placeholder="This can only be added using our mobile app" 
                    name="namePronunciation"
                    value={formData.namePronunciation}
                    onChange={handleChange}
                    disabled />
                  </div>
                  <div className="form-group">
                    <label htmlFor="headline">Headline*</label>
                    <input type="text" className="form-control"
                     id="headline" placeholder="A Front-End Dev and a Student"
                     name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    required />
                  </div>
                  {/* <div className="mb-3">
                    <button className="btn btn-outline-primary">Get AI suggestions with Premium</button>
                  </div> */}

                  <div>
        {/* Current Position */}
        <div className="mb-3">
          <label htmlFor="currentPosition" className="form-label">Current position</label>
                  {positions.map((position, index) => (
          <div key={index} className="position-group">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={position.title}
              onChange={e => handlePositionChange(index, 'title', e.target.value)}
            />
            <div className="form-group mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Company"
              value={position.company}
              onChange={e => handlePositionChange(index, 'company', e.target.value)}
            />
            </div>
            <div className="form-group mt-2">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              placeholder="Start Date"
              value={position.startDate}
              onChange={e => handlePositionChange(index, 'startDate', e.target.value)}
            />
            </div>
            <div className="form-group mt-2">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              placeholder="End Date"
              value={position.endDate}
              onChange={e => handlePositionChange(index, 'endDate', e.target.value)}
            />
            </div>
             <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="currentlyWorkingHere"
              checked={position.currentlyWorkingHere ?? false}
              onChange={e => handlePositionChange(index, 'currentlyWorkingHere', e.target.checked)}
            />
             <label className="form-check-label" htmlFor="currentlyWorkingHere">
              Still working Here
          </label>
            </div>             
            <button type="button" className="btn btn-primary" onClick={() => removePosition(index)}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={addPosition}>Add Another Position</button>

        </div>
        {/* Industry */}
        <div className="mb-3">
          <label htmlFor="industrySelect" className="form-label">Industry*</label>
          <select
            className="form-select"
              id="industrySelect"
              name="industry" // Name attribute for form data keys
              value={formData.industry} // This should be a state variable like formData.industry
              onChange={handleChange} // Same handler used for other inputs
            >
            <option value="">Choose...</option>
            <option value="tech">Technology, Information and Internet</option>
                {/* Add more options here */}
            </select>
          <div className="form-text">Learn more about <Link to="/">industry options</Link>.</div>
        </div>
        {/* Education */}
        <div className="mb-3">
          <label htmlFor="schoolSelect" className="form-label">School*</label>
          <select className="form-select"
           name="schoolSelect"
           value={formData.schoolSelect}
           onChange={handleChange} id="schoolSelect">
            <option value="">Choose...</option>
            <option value="1">University of Cape Coast</option>
            {/* Add more options here */}
          </select>
          <div className="form-check mt-2">
          <input
                  className="form-check-input"
                  type="checkbox"
                  id="showSchoolCheck"
                  name="showSchool" // Use the same name as the state field
                  checked={formData.showSchool ?? false} // Use checked for checkboxes
                  onChange={handleChange} // Same handler as other inputs
                />
              <label className="form-check-label" htmlFor="showSchoolCheck">
              Show school in my intro
          </label>
          </div>
          <div className="d-grid gap-2 mt-3">
            <button className="btn btn-outline-primary" type="button">+ Add new education</button>
          </div>
        </div>
       
        <div>
        {/* Location Section */}
        <div className="mb-3">
  <label htmlFor="countryRegion" className="form-label">Country/Region*</label>
  <input type="text" className="form-control" 
  id="countryRegion" placeholder="Ghana" 
  name="countryRegion"
  value={formData.countryRegion}
  onChange={handleChange}
  required />
</div>
<div className="mb-3">
  <label htmlFor="city" className="form-label">City</label>
  <input type="text" className="form-control" 
  id="city" placeholder="Accra, Greater Accra Region"
  name="city"
  value={formData.city}
  onChange={handleChange} />
</div>
        {/* Contact Info Section */}
        <div className="mt-4">
          <h6>Contact info</h6>
          <p className="text-secondary">Add or edit your profile URL, email, and more</p>
          <button type="button" className="btn btn-link p-0">Edit contact info</button>
        </div>
      </div>
        {/* Add location fields as necessary */}
      </div>
                
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
              </form>
            </div>
          </div>
        </div>







          </div>
        </div>
      </>
    );
    }

export default MyProfile;

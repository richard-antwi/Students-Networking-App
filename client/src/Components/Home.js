import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBookmark, faEnvelope, faGraduationCap, faMapMarkerAlt, faClock, faHeart, faComment, faEye } from '@fortawesome/free-solid-svg-icons';
import avatar from '../Images/avatar.webp';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import TopProfiles from './TopProfiles';
import withAuth from '../withAuth';

function Home() {
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    profileImagePath: '',
    firstName: '',
    lastName: '',
    userName: '',
    headline: '',
    followersCount: 0,
    followingCount: 0,
  });
  const [viewMore, setViewMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postContent, setPostContent] = useState({ text: '', image: null, video: null });
  const [following, setFollowing] = useState([]);

  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data) {
          setProfileData({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            userName: response.data.userName,
            headline: response.data.profile.headline,
            profileImagePath: response.data.profile.profileImagePath,
            followersCount: response.data.followersCount,
            followingCount: response.data.followingCount
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const imagePath = profileData.profileImagePath.replace(/\\/g, '/');
  const imageUrl = `http://localhost:3001/${imagePath}`;

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/posts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleText = (index) => {
    const updatedPosts = posts.map((post, i) => {
      if (i === index) {
        post.isTextExpanded = !post.isTextExpanded;
      }
      return post;
    });
    setPosts(updatedPosts);
  };
  const handlePostSubmit = async () => {
    const formData = new FormData();
    formData.append('text', postContent.text);
    if (postContent.image) {
      formData.append('image', postContent.image);
    }
    if (postContent.video) {
      formData.append('video', postContent.video);
    }

    try {
      await axios.post('http://localhost:3001/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowModal(false);
      setPostContent({ text: '', image: null, video: null });
      fetchPosts(); 
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleImageChange = (e) => {
    setPostContent({ ...postContent, image: e.target.files[0] });
  };

  const handleVideoChange = (e) => {
    setPostContent({ ...postContent, video: e.target.files[0] });
  };

  const handleTextChange = (e) => {
    setPostContent({ ...postContent, text: e.target.value });
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/friends/suggestions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSuggestions();
  }, []);

  const addFriend = (friendId) => {
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3001/api/friends', {
      recipientId: friendId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      alert('Friend request sent successfully!');
      setFollowing([...following, friendId]);
    })
    .catch(error => {
      console.error('Failed to add friend:', error.response.data.message);
      alert(`Failed to add friend: ${error.response.data.message}`);
    });
  };

  const removeFriend = (friendId) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3001/api/friends/${friendId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      alert('Unfollowed successfully!');
      setFollowing(following.filter(id => id !== friendId)); // Update following state
    })
    .catch(error => {
      console.error('Failed to remove friend:', error.response.data.message);
      alert(`Failed to remove friend: ${error.response.data.message}`);
    });
  };

  const toggleViewMore = () => {
    setViewMore(!viewMore);
  };

  return (
    <>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-md-3 side-section">
            <div className="card">
              <div className="card-header text-center" style={{ padding: '15px', margin: 0, background: 'linear-gradient(to bottom, #007bff 50%, #ffffff 50%)', color: '#fff' }}>
                {profileData.profileImagePath ? (
                  <img src={imageUrl || avatar} alt="User Avatar" className="img-fluid rounded-circle mb-3" style={{ width: '100px', height: '100px' }} />
                ) : (
                  <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mb-3" style={{ width: '100px', height: '100px' }} />
                )}
              </div>
              <div className="card-body text-center">
                <h5 className="card-title">{profileData.firstName} {profileData.lastName}</h5>
                <p className="card-text">{profileData.headline}</p>
                <div className="row">
                  <div className="col">
                    <p className="mb-0">Following</p>
                    <p className="font-weight-bold">{profileData.followingCount}</p>
                  </div>
                  <div className="col">
                    <p className="mb-0">Followers</p>
                    <p className="font-weight-bold">{profileData.followersCount}</p>
                  </div>
                </div>
                <hr />
                <Link to="/myprofile" className="btn btn-primary mt-3">View Profile</Link>
              </div>
            </div>
            {error && <p>Error: {error}</p>}
            <div className="card mt-5">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                <h5 className="mb-0">Suggestions</h5>
                <span>⋮</span>
              </div>
              <div className="card-body">
                {suggestions.map(suggestion => (
                  <div key={suggestion.user._id} className="d-flex justify-content-between align-items-center my-3">
                    <img src={suggestion.avatar || avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{ width: '40px', height: '40px' }} />
                    <div className="text-left">
                      <h6 className="mb-1">{suggestion.user.firstName} {suggestion.user.lastName}</h6>
                      <p className="mb-0 text-muted">{suggestion.user.headline}</p>
                    </div>
                    <div className="text-right" style={{ border: '#bdbebd solid 1px', padding: '4px' }}>
                      <FontAwesomeIcon onClick={() => addFriend(suggestion.user._id)} icon={faPlus} />
                    </div>
                  </div>
                ))}
                <div className="text-center mt-3">
                  <button className="btn btn-outline-primary" onClick={toggleViewMore}>{viewMore ? 'View Less' : 'View More'}</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card" style={{ borderTop: '5px solid #007bff' }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    {profileData.profileImagePath ? (
                      <img src={imageUrl} alt="User Avatar" className="img-fluid rounded-circle mb-3" style={{ width: '60px', height: '60px' }} />
                    ) : (
                      <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mb-3" style={{ width: '60px', height: '60px' }} />
                    )}
                  </div>
                  <div className="col-md-9 text-right mt-3">
                    <button className="btn mr-2"onClick={handleModalShow}>Make a Post</button>
                    <button className="btn btn-primary" onClick={handleModalShow}>Post a Job</button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {posts.map((post, index) => (
                <React.Fragment key={post._id}>
                  <div className="card mt-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <img src={post.user.profileImagePath ? `http://localhost:3001/${post.user.profileImagePath.replace(/\\/g, '/')}` : avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{ width: '50px', height: '50px' }} />
                        <div className="flex-grow-1 d-flex flex-column">
                          <div>
                            <h6 className="mb-0">{post.user.firstName} {post.user.lastName}</h6>
                          </div>
                          <div className="text-muted">
                            <FontAwesomeIcon icon={faClock} /> {new Date(post.postedAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <span>⋮</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <div className="mr-2">
                          <FontAwesomeIcon icon={faGraduationCap} className="text-danger" />
                        </div>
                        <div>
                          <p className="mb-0">{post.user.headline}</p>
                        </div>
                        <div className="ml-4 mr-2">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-success" />
                        </div>
                        <div>
                          <p className="mb-0">Ghana</p>
                        </div>
                        <div className="ml-auto">
                          <div className="mr-3">
                            <FontAwesomeIcon icon={faBookmark} className="text-white" style={{ border: '#13a550 solid 10px', background: '#13a550', borderRadius: '3px' }} />
                            <FontAwesomeIcon icon={faEnvelope} className="text-white" style={{ border: '#3e7df3 solid 10px', background: '#3e7df3', borderRadius: '3px' }} />
                          </div>
                        </div>
                      </div>
                      <br />
                      <div>
                        <h5>Senior Wordpress Developer</h5>
                      </div>
                      <div className="ml-auto">
                        <span className="badge bg-success rounded-pill text-white p-2">Full Time</span>
                        <span className="ml-2">$30/hr</span>
                      </div>
                      <br />
                      <div>
                        <p className={`mb-0 ${post.isTextExpanded ? '' : 'truncated-text'}`} id="longText">
                        {post.imagePath && (
                        <div className="mt-3">
                          <img src={`http://localhost:3001${post.imagePath}`} alt="Post Media" className="img-fluid" />
                        </div>
                      )}
                      {post.videoPath && (
                        <div className="mt-3">
                          <video width="100%" height="auto" controls>
                            <source src={`http://localhost:3001${post.videoPath}`} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                          {post.content}
                        </p>
                        <Link to="/" className="text-primary" id="readMoreLink" role="button" onClick={() => toggleText(index)}>
                          {post.isTextExpanded ? 'Read Less' : 'Read More'}
                        </Link>
                      </div>
                     
                      <div className="mb-3" style={{ marginTop: '8px' }}>
                        {post.tags.map((tag, i) => (
                          <span key={i} className="badge badge-secondary rounded-pill p-2" style={{ borderRadius: '12px' }}>{tag}</span>
                        ))}
                      </div>
                      <hr />
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faHeart} className="text-danger mr-2" />
                          <span className="mr-3">Like</span>
                          <div className="rounded-circle bg-secondary text-white px-2">{post.likes}</div>
                        </div>
                        <a data-toggle="collapse" href="#commentCollapse" role="button" aria-expanded="false" aria-controls="commentCollapse">
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faComment} className="text-primary mr-2" />
                            <span className="mr-3">Comment</span>
                            <div className="rounded-circle bg-secondary text-white px-2">{post.comments.length}</div>
                          </div>
                        </a>
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faEye} className="text-success mr-2" />
                          <span>View</span>
                          <div className="rounded-circle bg-secondary text-white px-2">{post.views}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(index === 0 || (index + 1) % 3 === 0) && <TopProfiles avatar={avatar} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="col-md-3 side-section">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                <h5 className="mb-0">Top Jobs</h5>
                <span>⋮</span>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="text-left">
                    <h6 className="card-title">Senior Product Designer</h6>
                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-weight-bold">$50/hr</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div className="text-left">
                    <h6 className="card-title">Senior UI/UX Designer</h6>
                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="text-right mb-3">
                    <p className="font-weight-bold">$50/hr</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div className="text-left">
                    <h6 className="card-title">Senior Programmer</h6>
                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="text-right mb-3">
                    <p className="font-weight-bold">$50/hr</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div className="text-left">
                    <h6 className="card-title">Senior Front-End Developer</h6>
                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="text-right mb-3">
                    <p className="font-weight-bold">$50/hr</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-5">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                <h5 className="mb-0">Most Viewed This Week</h5>
                <span>⋮</span>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="text-left">
                    <h6 className="card-title">Senior Product Designer</h6>
                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-weight-bold">$50/hr</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div className="text-left">
                    <h6 className="card-title">Senior UI/UX Designer</h6>
                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="text-right mb-3">
                    <p className="font-weight-bold">$50/hr</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div className="text-left">
                    <h6 className="card-title">Senior Programmer</h6>
                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="text-right mb-3">
                    <p className="font-weight-bold">$50/hr</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-5">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                <h5 className="mb-0">Most Viewed People</h5>
                <span>⋮</span>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{ width: '40px', height: '40px' }} />
                  <div className="text-left">
                    <h6 className="mb-1">John Doe</h6>
                    <p className="mb-0 text-muted">Web Developer</p>
                  </div>
                  <div className="text-right" style={{ border: '#bdbebd solid 1px', padding: '4px' }}>
                    <i className="fas fa-plus" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Post a Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="postText">
              <Form.Label>Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={postContent.text}
                onChange={handleTextChange}
              />
            </Form.Group>
            <Form.Group controlId="postImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>
            <Form.Group controlId="postVideo">
              <Form.Label>Video</Form.Label>
              <Form.Control type="file" accept="video/*" onChange={handleVideoChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePostSubmit}>
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default withAuth(Home);

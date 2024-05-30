import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBookmark, faEnvelope, faGraduationCap, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import avatar from '../Images/avatar.webp';
import axios from 'axios';

function Home() {
  
  const [viewMore, setViewMore] = useState(false);
  const [isTextExpanded, setTextExpanded] = useState(false);
  // const [error, setError] = useState(null);

const toggleText = () => {
    setTextExpanded(!isTextExpanded);
};

  const [suggestions, setSuggestions] = useState([]);
  // const [setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({ profileImagePath: '',firstName: '',
  lastName: '',
  userName: '',
  headline: '', });
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
                    headline: response.data.profile.headline,
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
// console.log(imageUrl)

  useEffect(() => {
      const fetchSuggestions = async () => {
          // setLoading(true);
          setError('');
          try {
              const token = localStorage.getItem('token'); // Assuming token is stored in local storage
              const response = await fetch('http://localhost:3001/api/suggestions', {
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
              // console.log('Suggestions:', data);

              
              // console.log(setSuggestions(data.suggestions))
          } catch (err) {
              setError(err.message);
          } 
          // finally {
          //     // setLoading(false);
          // }
      };
        console.log()
      fetchSuggestions();
  }, []);

  //add frinds
  function addFriend(friendId) {
    const token = localStorage.getItem('token');
    axios.post(`http://localhost:3001/api/friendships`, {
        recipientId: friendId
    }, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        alert('Friend request sent successfully!');
        // You might want to update the UI here to reflect the friendship status
    })
    .catch(error => {
        console.error('Failed to add friend:', error.response.data.message);
        alert(`Failed to add friend: ${error.response.data.message}`);
    });
}


  const toggleViewMore = () => {
    setViewMore(!viewMore);
  };
  return (
    <>
  
        {/*-------------- Main Content -----------------------*/}
        <div className="container-fluid mt-5">
          <div className="row ">
            {/* Left Side Section */}
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
              {/* User Details */}
              <h5 className="card-title"> {profileData.firstName} {profileData.lastName}</h5>
              <p className="card-text"> {profileData.headline}</p>
              {/* Followers and Following */}
              <div className="row">
                <div className="col">
                  <p className="mb-0">Following</p>
                  <p className="font-weight-bold">100</p>
                </div>
                <div className="col">
                  <p className="mb-0">Followers</p>
                  <p className="font-weight-bold">500</p>
                </div>
              </div>
              <hr />
              <Link to="/myprofile" className="btn btn-primary mt-3">View Profile</Link>
            </div>
          </div>
          {error && <p>Error: {error}</p>}
          {/* {loading && <p>Loading...</p>} */}

          <div className="card mt-5">
            <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
              <h5 className="mb-0">Suggestions</h5>
              <span>⋮</span>
            </div>
            <div className="card-body">
            {suggestions.map(suggestion => (
                  <div key={suggestion.user._id} className="d-flex justify-content-between align-items-center my-3">
                    {/* {console.log(suggestion.user.firstName)} */}
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

            {/* Center Section */}
            <div className="col-md-6">
              
              {/* Post Section (Sample Post) */}
              <div className="card" style={{borderTop: '5px solid #007bff'}}>
                <div className="card-body">
                  <div className="row">
                    {/* Avatar on the left */}
                    <div className="col-md-3">
                    {profileData.profileImagePath ? (
                    <img src={imageUrl} alt="User Avatar" className="img-fluid rounded-circle mb-3" style={{width: '60px', height: '60px'}} />
                  ) : (
                    <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mb-3" style={{width: '60px', height: '60px'}} />
                  )}
                    </div>
                    {/* Buttons on the right */}
                    <div className="col-md-9 text-right mt-3">
                      <button className="btn  mr-2">Post a Project</button>
                      <button className="btn btn-primary">Post a Job</button>
                    </div>
                  </div>
                </div>
              </div>
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
              
                      <div className="text-muted">
                      <FontAwesomeIcon icon={faClock} />
                        {/* <i className="fa-solid fa-clock" />  */}
                        3 min ago
                      </div>
                    </div>

                    <div className="ml-auto">
                      <span>⋮</span>
                    </div>
                  </div>
                  {/* User interests and location */}
                  <div className="d-flex align-items-center mb-2">
                    <div className="mr-2">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-danger"/>
                      {/* <i className="fas fa-graduation-cap text-danger" /> */}
                    </div>
                    <div>
                      <p className="mb-0">Epic Developer</p>
                    </div>
                    {/* Location icon and text */}
                    <div className="ml-4 mr-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-success"/>
                      {/* <i className="fas fa-map-marker-alt text-success" /> */}
                    </div>
                    <div>
                      <p className="mb-0">Ghana</p>
                    </div>
                    {/* Favourite and message icons on the right */}
                    <div className="ml-auto">
                      <div className="mr-3">
                      <FontAwesomeIcon icon={faBookmark} className="text-white" style={{border: '#13a550 solid 10px', background: '#13a550', borderRadius: '3px'}}/>
                      <FontAwesomeIcon icon={faEnvelope} className="text-white" style={{border: '#3e7df3 solid 10px', background: '#3e7df3', borderRadius: '3px'}}/>

                        {/* <i className="far fa-bookmark text-white" style={{border: '#13a550 solid 10px', background: '#13a550', borderRadius: '3px'}} /> */}
                        {/* <i className="far fa-envelope text-white" style={{border: '#3e7df3 solid 10px', background: '#3e7df3', borderRadius: '3px'}} /> */}
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
                    <Link to="/" className="text-primary" id="readMoreLink" role="button" onClick={toggleText}>
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
              <div className="container mt-5">
                <h5>Top Profiles</h5>
                <div id="cardSlider" className="carousel slide" data-ride="carousel">
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <div className="d-flex">
                        <div className="card mr-3" style={{width: '18rem'}}>
                          {/* New Card Content */}
                          <div className="card-body text-center">
                            {/* Avatar at the top center */}
                            <img src={avatar} className="card-img-top rounded-circle mb-3" alt="User Avatar" style={{width: '80px', height: '80px'}} />
                            {/* Centered Name */}
                            <h5 className="card-title mb-2">John Doe</h5>
                            {/* Developer Text */}
                            <p className="card-text text-muted">Developer</p>
                            <div className="d-flex justify-content-between">
                              {/* Follow Button */}
                              <button className="btn btn-success btn-sm mb-2">Follow</button>
                              {/* Envelop Icon Button */}
                              <button className="btn btn-danger btn-sm mb-2 ml-1">
                                <i className="fas fa-envelope" />
                              </button>
                              {/* Hire Button */}
                              <button className="btn btn-primary btn-sm mb-2 ml-1">Hire</button>
                            </div>
                            <hr />
                            <h5> Veiw Profile</h5>
                          </div>
                        </div>
                        <div className="card mr-3" style={{width: '18rem'}}>
                          {/* New Card Content */}
                          <div className="card-body text-center">
                            {/* Avatar at the top center */}
                            <img src={avatar} className="card-img-top rounded-circle mb-3" alt="User Avatar" style={{width: '80px', height: '80px'}} />
                            {/* Centered Name */}
                            <h5 className="card-title mb-2">John Doe</h5>
                            {/* Developer Text */}
                            <p className="card-text text-muted">Developer</p>
                            <div className="d-flex justify-content-between">
                              {/* Follow Button */}
                              <button className="btn btn-success btn-sm mb-2">Follow</button>
                              {/* Envelop Icon Button */}
                              <button className="btn btn-danger btn-sm mb-2 ml-1">
                                <i className="fas fa-envelope" />
                              </button>
                              {/* Hire Button */}
                              <button className="btn btn-primary btn-sm mb-2 ml-1">Hire</button>
                            </div>
                            <hr />
                            <h5> Veiw Profile</h5>
                          </div>
                        </div>
                        <div className="card mr-3" style={{width: '18rem'}}>
                          {/* New Card Content */}
                          <div className="card-body text-center">
                            {/* Avatar at the top center */}
                            <img src={avatar} className="card-img-top rounded-circle mb-3" alt="User Avatar" style={{width: '80px', height: '80px'}} />
                            {/* Centered Name */}
                            <h5 className="card-title mb-2">John Doe</h5>
                            {/* Developer Text */}
                            <p className="card-text text-muted">Developer</p>
                            <div className="d-flex justify-content-between">
                              {/* Follow Button */}
                              <button className="btn btn-success btn-sm mb-2">Follow</button>
                              {/* Envelop Icon Button */}
                              <button className="btn btn-danger btn-sm mb-2 ml-1">
                                <i className="fas fa-envelope" />
                              </button>
                              {/* Hire Button */}
                              <button className="btn btn-primary btn-sm mb-2 ml-1">Hire</button>
                            </div>
                            <hr />
                            <h5> Veiw Profile</h5>
                          </div>
                        </div>
                        {/* Add more cards as needed for Item 1 */}
                      </div>
                    </div>
                    {/* Additional Carousel Items */}
                    <div className="carousel-item">
                      <div className="d-flex">
                        <div className="card mr-3" style={{width: '18rem'}}>
                          {/* New Card Content */}
                          <div className="card-body text-center">
                            {/* Avatar at the top center */}
                            <img src={avatar} className="card-img-top rounded-circle mb-3" alt="User Avatar" style={{width: '80px', height: '80px'}} />
                            {/* Centered Name */}
                            <h5 className="card-title mb-2">John Doe</h5>
                            {/* Developer Text */}
                            <p className="card-text text-muted">Developer</p>
                            <div className="d-flex justify-content-between">
                              {/* Follow Button */}
                              <button className="btn btn-success btn-sm mb-2">Follow</button>
                              {/* Envelop Icon Button */}
                              <button className="btn btn-danger btn-sm mb-2 ml-1">
                                <i className="fas fa-envelope" />
                              </button>
                              {/* Hire Button */}
                              <button className="btn btn-primary btn-sm mb-2 ml-1">Hire</button>
                            </div>
                            <hr />
                            <h5> Veiw Profile</h5>
                          </div>
                        </div>
                        <div className="card mr-3" style={{width: '18rem'}}>
                          {/* New Card Content */}
                          <div className="card-body text-center">
                            {/* Avatar at the top center */}
                            <img src={avatar} className="card-img-top rounded-circle mb-3" alt="User Avatar" style={{width: '80px', height: '80px'}} />
                            {/* Centered Name */}
                            <h5 className="card-title mb-2">John Doe</h5>
                            {/* Developer Text */}
                            <p className="card-text text-muted">Developer</p>
                            <div className="d-flex justify-content-between">
                              {/* Follow Button */}
                              <button className="btn btn-success btn-sm mb-2">Follow</button>
                              {/* Envelop Icon Button */}
                              <button className="btn btn-danger btn-sm mb-2 ml-1">
                                <i className="fas fa-envelope" />
                              </button>
                              {/* Hire Button */}
                              <button className="btn btn-primary btn-sm mb-2 ml-1">Hire</button>
                            </div>
                            <hr />
                            <h5> Veiw Profile</h5>
                          </div>
                        </div>
                        <div className="card mr-3" style={{width: '18rem'}}>
                          {/* New Card Content */}
                          <div className="card-body text-center">
                            {/* Avatar at the top center */}
                            <img src={avatar} className="card-img-top rounded-circle mb-3" alt="User Avatar" style={{width: '80px', height: '80px'}} />
                            {/* Centered Name */}
                            <h5 className="card-title mb-2">John Doe</h5>
                            {/* Developer Text */}
                            <p className="card-text text-muted">Developer</p>
                            <div className="d-flex justify-content-between">
                              {/* Follow Button */}
                              <button className="btn btn-success btn-sm mb-2">Follow</button>
                              {/* Envelop Icon Button */}
                              <button className="btn btn-danger btn-sm mb-2 ml-1">
                                <i className="fas fa-envelope" />
                              </button>
                              {/* Hire Button */}
                              <button className="btn btn-primary btn-sm mb-2 ml-1">Hire</button>
                            </div>
                            <hr />
                            <h5> Veiw Profile</h5>
                          </div>
                        </div>
                        {/* Add more cards as needed for Item 2 */}
                      </div>
                    </div>
                    {/* Add more carousel items as needed */}
                  </div>
                  <a className="carousel-control-prev" href="#cardSlider" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="sr-only">Previous</span>
                  </a>
                  <a className="carousel-control-next" href="#cardSlider" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="sr-only">Next</span>
                  </a>
                </div>
              </div>
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
                    <Link to="/" className="text-primary" id="readMoreLink" role="button" onClick={toggleText}>
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
                    <div className="d-flex align-items-center">
                      <i className="fas fa-comment text-primary mr-2" />
                      <span className="mr-3">Comment</span>
                      <div className="rounded-circle bg-secondary text-white px-2">5</div>
                    </div>
                    {/* View Section */}
                    <div className="d-flex align-items-center">
                      <i className="fas fa-eye text-success mr-2" />
                      <span>View</span>
                      <div className="rounded-circle bg-secondary text-white px-2">90</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Side Section */}
            <div className="col-md-3 side-section">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: '#fff'}}>
                  {/* Heading on the left */}
                  <h5 className="mb-0">Top Jobs</h5>
                  {/* Three dots on the right */}
                  <span>⋮</span>
                </div>
                <div className="card-body">
                  {/* Job details */}
                  <div className="d-flex justify-content-between">
                    {/* Job title and text on the left */}
                    <div className="text-left">
                      <h6 className="card-title">Senior Product Designer</h6>
                      <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    {/* Price per hour on the right */}
                    <div className="text-right ">
                      <p className="font-weight-bold">$50/hr</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    {/* Job title and text on the left */}
                    <div className="text-left">
                      <h6 className="card-title">Senior UI/UX Designer</h6>
                      <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    {/* Price per hour on the right */}
                    <div className="text-right mb-3">
                      <p className="font-weight-bold">$50/hr</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    {/* Job title and text on the left */}
                    <div className="text-left">
                      <h6 className="card-title">Senior Programmer</h6>
                      <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    {/* Price per hour on the right */}
                    <div className="text-right mb-3">
                      <p className="font-weight-bold">$50/hr</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    {/* Job title and text on the left */}
                    <div className="text-left">
                      <h6 className="card-title">Senior Front-End Developer</h6>
                      <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    {/* Price per hour on the right */}
                    <div className="text-right mb-3">
                      <p className="font-weight-bold">$50/hr</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-5">
                <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: '#fff'}}>
                  {/* Heading on the left */}
                  <h5 className="mb-0">Most Viewed This Week</h5>
                  {/* Three dots on the right */}
                  <span>⋮</span>
                </div>
                <div className="card-body">
                  {/* Job details */}
                  <div className="d-flex justify-content-between">
                    {/* Job title and text on the left */}
                    <div className="text-left">
                      <h6 className="card-title">Senior Product Designer</h6>
                      <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    {/* Price per hour on the right */}
                    <div className="text-right ">
                      <p className="font-weight-bold">$50/hr</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    {/* Job title and text on the left */}
                    <div className="text-left">
                      <h6 className="card-title">Senior UI/UX Designer</h6>
                      <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    {/* Price per hour on the right */}
                    <div className="text-right mb-3">
                      <p className="font-weight-bold">$50/hr</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    {/* Job title and text on the left */}
                    <div className="text-left">
                      <h6 className="card-title">Senior Programmer</h6>
                      <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    {/* Price per hour on the right */}
                    <div className="text-right mb-3">
                      <p className="font-weight-bold">$50/hr</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-5">
                <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: '#fff'}}>
                  {/* Heading on the left */}
                  <h5 className="mb-0">Most Viewed People</h5>
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
        </div>
        </>
     );
    }
    
    export default Home;
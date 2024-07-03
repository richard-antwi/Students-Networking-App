import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import avatar from '../Images/avatar.webp';
import FollowButton from './FollowButton';

const TopProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/top-profiles', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfiles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top profiles:', error);
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleFollowChange = () => {
    // Re-fetch profiles or update state as needed
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="container mt-5">
      <h5>Top Profiles</h5>
      <div id="cardSlider" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          {profiles.map((profile, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={profile._id}>
              <div className="d-flex justify-content-around">
                {profiles.slice(index, index + 3).map(profile => (
                  <ProfileCard
                    key={profile._id}
                    avatar={profile.profile.profileImagePath ? `http://localhost:3001/${profile.profile.profileImagePath.replace(/\\/g, '/')}` : avatar}
                    name={`${profile.firstName} ${profile.lastName}`}
                    role={profile.profile.headline}
                    userId={profile._id}
                    followId={profile._id}
                    isFollowing={false}
                    onFollowChange={handleFollowChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <a className="carousel-control-prev custom-carousel-control" href="#cardSlider" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next custom-carousel-control" href="#cardSlider" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="sr-only">Next</span>
        </a>
      </div>
    </div>
  );
};

const ProfileCard = ({ avatar, name, role, userId, followId, isFollowing, onFollowChange }) => (
  <div className="card mr-3">
    <div className="card-body text-center">
      <img src={avatar} className="card-img-top rounded-circle mb-3" alt="User Avatar" style={{ width: '80px', height: '80px' }} />
      <h5 className="card-title mb-2">{name}</h5>
      <p className="card-text text-muted">{role}</p>
      <div className="d-flex justify-content-between">
        <FollowButton userId={userId} followId={followId} isFollowing={isFollowing} onFollowChange={onFollowChange} />
        <button className="btn btn-danger btn-sm mb-2 ml-1">
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button className="btn btn-primary btn-sm mb-2 ml-1">Hire</button>
      </div>
      <hr />
      <h5>View Profile</h5>
    </div>
  </div>
);

export default TopProfiles;








// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import avatar from '../Images/avatar.webp';
// const TopProfiles = () => (
//   <div className="container mt-5">
//     <h5>Top Profiles</h5>
//     <div id="cardSlider" className="carousel slide" data-ride="carousel">
//       <div className="carousel-inner">
//         <div className="carousel-item active">
//           <div className="d-flex">
//             <ProfileCard avatar={avatar} name="John Doe" role="Developer" />
//             <ProfileCard avatar={avatar} name="Jane Smith" role="Designer" />
//             <ProfileCard avatar={avatar} name="Alice Johnson" role="Project Manager" />
//           </div>
//         </div>
        
//       </div>
//       <a className="carousel-control-prev" href="#cardSlider" role="button" data-slide="prev">
//         <span className="carousel-control-prev-icon" aria-hidden="true" />
//         <span className="sr-only">Previous</span>
//       </a>
//       <a className="carousel-control-next" href="#cardSlider" role="button" data-slide="next">
//         <span className="carousel-control-next-icon" aria-hidden="true" />
//         <span className="sr-only">Next</span>
//       </a>
//     </div>
//   </div>
// );

// const ProfileCard = ({ avatar, name, role }) => (
//   <div className="card mr-3" style={{ width: '18rem' }}>
//     <div className="card-body text-center">
//       <img src={avatar} className="card-img-top rounded-circle mb-3" alt="User Avatar" style={{ width: '80px', height: '80px' }} />
//       <h5 className="card-title mb-2">{name}</h5>
//       <p className="card-text text-muted">{role}</p>
//       <div className="d-flex justify-content-between">
//         <button className="btn btn-success btn-sm mb-2">Follow</button>
//         <button className="btn btn-danger btn-sm mb-2 ml-1">
//           <FontAwesomeIcon icon={faEnvelope} />
//         </button>
//         <button className="btn btn-primary btn-sm mb-2 ml-1">Hire</button>
//       </div>
//       <hr />
//       <h5>View Profile</h5>
//     </div>
//   </div>
// );

// export default TopProfiles;



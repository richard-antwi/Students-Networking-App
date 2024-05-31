import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import avatar from '../Images/avatar.webp';
const TopProfiles = () => (
  <div className="container mt-5">
    <h5>Top Profiles</h5>
    <div id="cardSlider" className="carousel slide" data-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="d-flex">
            <ProfileCard avatar={avatar} name="John Doe" role="Developer" />
            <ProfileCard avatar={avatar} name="Jane Smith" role="Designer" />
            <ProfileCard avatar={avatar} name="Alice Johnson" role="Project Manager" />
          </div>
        </div>
        {/* Add more carousel items if needed */}
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
);

const ProfileCard = ({ avatar, name, role }) => (
  <div className="card mr-3" style={{ width: '18rem' }}>
    <div className="card-body text-center">
      <img src={avatar} className="card-img-top rounded-circle mb-3" alt="User Avatar" style={{ width: '80px', height: '80px' }} />
      <h5 className="card-title mb-2">{name}</h5>
      <p className="card-text text-muted">{role}</p>
      <div className="d-flex justify-content-between">
        <button className="btn btn-success btn-sm mb-2">Follow</button>
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



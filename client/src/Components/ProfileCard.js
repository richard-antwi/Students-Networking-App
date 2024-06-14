import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import FollowButton from './FollowButton';
// import avatar from '../Images/avatar.webp';

const ProfileCard = ({ avatar, name, role, userId, followId, isFollowing, onFollowChange }) => (
  <div className="card mr-3" style={{ width: '18rem' }}>
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

export default ProfileCard;

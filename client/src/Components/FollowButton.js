import React, { useState } from 'react';
import axios from 'axios';

const FollowButton = ({ userId, followId, isFollowing, onFollowChange }) => {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:3001/api/user/${isFollowing ? 'unfollow' : 'follow'}`, {
        followId,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onFollowChange();
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn btn-success btn-sm mb-2" onClick={handleFollow} disabled={loading}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;

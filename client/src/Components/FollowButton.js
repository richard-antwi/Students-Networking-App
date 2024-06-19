// FollowButton.js
import React, { useState } from 'react';
import axios from 'axios';

const FollowButton = ({ userId, isFollowing, onFollowChange }) => {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const url = isFollowing ? 'http://localhost:3001/api/user/unfollow' : 'http://localhost:3001/api/user/follow';
      const response = await axios.post(url, { followId: userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onFollowChange();
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn btn-success btn-sm mb-2 ml-1" onClick={handleFollow} disabled={loading}>
      {loading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;

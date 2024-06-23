// FollowButton.js
import React, { useState } from 'react';
import axios from 'axios';

const FollowButton = ({ userId, isFollowing, onFollowChange }) => {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const url = isFollowing ? 'http://localhost:3001/api/user/unfollow' : 'http://localhost:3001/api/user/follow';
      const token = localStorage.getItem('token');
      console.log('Sending request to:', url);
      console.log('With token:', token);
      console.log('And followId:', userId);
      const response = await axios.post(url, { followId: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onFollowChange();
      console.log('Response:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
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

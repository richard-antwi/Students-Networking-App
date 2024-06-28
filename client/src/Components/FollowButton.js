import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowButton = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch initial follow status
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');
        const response = await axios.get(`http://localhost:3001/api/user/${userId}/isFollowing`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };
    fetchFollowStatus();
  }, [userId]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const url = isFollowing ? 'http://localhost:3001/api/user/unfollow' : 'http://localhost:3001/api/user/follow';
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const response = await axios.post(url, { followId: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(!isFollowing);
      console.log('Response:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Full error:', error);
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

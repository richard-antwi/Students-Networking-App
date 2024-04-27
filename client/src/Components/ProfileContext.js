import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({ profileImagePath: '' });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found for fetching profile data');
        return;
      }
      try {
        const response = await axios.get('http://localhost:3001/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.profileImagePath) {
          // Use functional update to set profileData
          setProfileData(prevProfileData => ({
            ...prevProfileData,
            ...response.data
          }));
        }
      
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };
  
    fetchProfileData();
  }, []); // No dependency here
  
  useEffect(() => {
    const imageUrl = `http://localhost:3001/${profileData.profileImagePath.replace(/\\/g, '/')}`;
    console.log(imageUrl);
  }, [profileData]);
  

  return (
    <ProfileContext.Provider value={{ imageUrl: `http://localhost:3001/${profileData.profileImagePath.replace(/\\/g, '/')}` }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileProvider };
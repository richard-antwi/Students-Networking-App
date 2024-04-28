import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import avatar from '../Images/avatar.webp'; // Import default profile image

const initialState = {
  profileImagePath: '', // Initially empty
  loading: true,
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        ...state,
        profileImagePath: action.payload.profileImagePath,
        loading: false
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        error: action.payload.error,
        loading: false
      };
    default:
      return state;
  }
};

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token found, set default image path
        dispatch({ type: 'FETCH_SUCCESS', payload: { profileImagePath: avatar } });
        return;
      }
      try {
        const response = await axios.get('http://localhost:3001/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.profileImagePath) {
          dispatch({ type: 'FETCH_SUCCESS', payload: { profileImagePath: response.data.profileImagePath } });
        } else {
          // If no profile image found, set default image path
          dispatch({ type: 'FETCH_SUCCESS', payload: { profileImagePath: avatar } });
        }
      } catch (error) {
        // If error fetching profile data, set default image path
        dispatch({ type: 'FETCH_ERROR', payload: { error: 'Failed to fetch profile data' } });
      }
    };

    fetchProfileData();
  }, []);

  const { profileImagePath, loading } = state;

  // Construct the image URL
  const imageUrl = loading ? '' : `http://localhost:3001/${profileImagePath.replace(/\\/g, '/')}`;

  return (
    <ProfileContext.Provider value={{ imageUrl, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileProvider };
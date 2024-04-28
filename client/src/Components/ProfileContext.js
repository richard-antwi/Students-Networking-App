import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
  profileImagePath: '',
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
        dispatch({ type: 'FETCH_ERROR', payload: { error: 'No token found for fetching profile data' } });
        return;
      }
      try {
        const response = await axios.get('http://localhost:3001/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.profileImagePath) {
          dispatch({ type: 'FETCH_SUCCESS', payload: { profileImagePath: response.data.profileImagePath } });
        }
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: { error: 'Failed to fetch profile data' } });
      }
    };

    fetchProfileData();
  }, []);

  const { profileImagePath, loading, error } = state;

  const imageUrl = loading ? '' : `http://localhost:3001/${profileImagePath.replace(/\\/g, '/')}`;

  return (
    <ProfileContext.Provider value={{ imageUrl, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileProvider };

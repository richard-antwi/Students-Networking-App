// src/withAuth.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  const AuthHOC = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      // console.log('Token:', token); // Add this line
      if (!token) {
        navigate('/register');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;

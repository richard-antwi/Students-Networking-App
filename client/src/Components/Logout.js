// src/Components/Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token and user ID from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Redirect to the login page
    navigate('/register');
  }, [navigate]);

  return null;
};

export default Logout;

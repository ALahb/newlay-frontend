import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserDetails } from '../api';
import { getUrlParams } from '../utils/urlParams';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserDetails = async (userId) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await getUserDetails(userId);
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (err) {
      setError(err.message || 'Failed to fetch user details');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('userData');
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('userData', JSON.stringify(newUserData));
  };

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      try {
        const parsedUserData = JSON.parse(savedUserData);
        setUser(parsedUserData);
      } catch (err) {
        console.error('Error parsing saved user data:', err);
        localStorage.removeItem('userData');
      }
    }
  }, []);

  useEffect(() => {
    const { userId } = getUrlParams();
    console.log('userId', userId);
    localStorage.setItem('userId', userId);

    if (userId && !user) {
      console.log('Auto-fetching user details for userId:', userId);
      fetchUserDetails(userId);
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    fetchUserDetails,
    clearUser,
    updateUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 
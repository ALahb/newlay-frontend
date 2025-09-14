import React, { createContext, useContext } from 'react';
import { useAuthentication } from './AuthenticationContext';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user, loading, error, updateUser, fetchUserDetails } = useAuthentication();

  const clearUser = () => {
    // This will be handled by the AuthenticationContext
    updateUser(null);
  };

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
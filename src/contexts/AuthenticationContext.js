import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserDetails } from '../api';

const AuthenticationContext = createContext();

export function AuthenticationProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Function to decode token and extract user/org info
  const decodeToken = (tokenString) => {
    try {
      const decoded = jwtDecode(tokenString);
      const extractedUserId = decoded['custom:rology_user'] ||
                             decoded['sub'] ||
                             decoded['userId'] ||
                             decoded['user_id'];
      
      const extractedOrgId = decoded['custom:organizationId'] ||
                            decoded['organizationId'] ||
                            decoded['orgId'] ||
                            decoded['organization_id'];

      return {
        userId: extractedUserId,
        organizationId: extractedOrgId,
        decoded
      };
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      throw new Error('Invalid token format');
    }
  };

  // Function to fetch user details from API
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
      return userData;
    } catch (err) {
      setError(err.message || 'Failed to fetch user details');
      console.error('Error fetching user details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to set token and decode it
  const setAuthToken = async (tokenString) => {
    try {
      const { userId: extractedUserId, organizationId: extractedOrgId } = decodeToken(tokenString);
      
      setToken(tokenString);
      setUserId(extractedUserId);
      setOrganizationId(extractedOrgId);
      
      // Fetch user details if we have a userId
      if (extractedUserId) {
        await fetchUserDetails(extractedUserId);
      }
      
      return { userId: extractedUserId, organizationId: extractedOrgId };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Function to clear authentication data
  const clearAuth = () => {
    setUser(null);
    setOrganizationId(null);
    setUserId(null);
    setToken(null);
    setError(null);
  };

  // Function to update user data
  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  // Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Listen for messages from parent window
      const handleMessage = (event) => {
        const data = event?.data;
        if (!data) return;

        // Case 1: Explicit token message
        if (data.type === 'idToken' && data.token) {
          setAuthToken(data.token);
          return;
        }

        // Case 2: Bare token without type
        if (data.token && typeof data.token === 'string') {
          setAuthToken(data.token);
          return;
        }

        // Case 3: Parent sends plain IDs or a different type
        if (
          (data.type === 'AUTH' || data.type === 'AUTH_INFO' || !data.type) &&
          (data.userId || data.user_id) &&
          (data.organizationId || data.orgId || data.organization_id)
        ) {
          setUserId(data.userId || data.user_id);
          setOrganizationId(data.organizationId || data.orgId || data.organization_id);
          if (data.userId || data.user_id) {
            fetchUserDetails(data.userId || data.user_id);
          }
          return;
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Fallback: read from URL params if present
      try {
        const params = new URLSearchParams(window.location.search);
        const urlUserId = params.get('userId');
        const urlOrgId = params.get('organizationId');
        if (urlUserId) {
          setUserId(urlUserId);
          fetchUserDetails(urlUserId);
        }
        if (urlOrgId) {
          setOrganizationId(urlOrgId);
        }
      } catch (_) {}

      // Initiate handshake with parent to request token
      // This will be called on every page refresh to ensure we get the latest token
      const requestToken = () => {
        try {
          const request = { type: 'REQUEST_ID_TOKEN' };
          window.parent?.postMessage(request, '*');
        } catch (error) {
          console.warn('Failed to request token from parent:', error);
        }
      };

      // Request token immediately and set up retry mechanism
      requestToken();
      const retryTimer = setTimeout(requestToken, 500);
      const retryTimer2 = setTimeout(requestToken, 1000);

      return () => {
        window.removeEventListener('message', handleMessage);
        clearTimeout(retryTimer);
        clearTimeout(retryTimer2);
      };
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    organizationId,
    userId,
    token,
    loading,
    error,
    setAuthToken,
    clearAuth,
    updateUser,
    fetchUserDetails,
    decodeToken
  };

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication() {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuthentication must be used within an AuthenticationProvider');
  }
  return context;
}

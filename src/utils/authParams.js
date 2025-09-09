/**
 * Authentication parameters utility
 * Handles authentication data with priority: URL params > localStorage > memory storage
 */

import storageManager from './storage';
import { getUrlParams } from './urlParams';

/**
 * Get authentication parameters with fallback strategy
 * Priority: URL params > localStorage > memory storage
 * @returns {Object} { userId, organizationId, source }
 */
export const getAuthParams = () => {
  const urlParams = getUrlParams();
  const { userId: urlUserId, organizationId: urlOrgId } = urlParams;
  
  // If URL params exist, use them and store in storage
  if (urlUserId || urlOrgId) {
    if (urlUserId) {
      storageManager.setItem('userId', urlUserId);
    }
    if (urlOrgId) {
      storageManager.setItem('orgId', urlOrgId);
    }
    
    return {
      userId: urlUserId,
      organizationId: urlOrgId,
      source: 'url'
    };
  }
  
  // Fallback to storage
  const storedUserId = storageManager.getItem('userId');
  const storedOrgId = storageManager.getItem('orgId');
  
  return {
    userId: storedUserId,
    organizationId: storedOrgId,
    source: storageManager.getStorageType()
  };
};

/**
 * Set authentication parameters
 * @param {string} userId 
 * @param {string} organizationId 
 */
export const setAuthParams = (userId, organizationId) => {
  if (userId) {
    storageManager.setItem('userId', userId);
  }
  if (organizationId) {
    storageManager.setItem('orgId', organizationId);
  }
};

/**
 * Clear authentication parameters
 */
export const clearAuthParams = () => {
  storageManager.removeItem('userId');
  storageManager.removeItem('orgId');
  storageManager.removeItem('userData');
};

/**
 * Check if we're in iframe context
 * @returns {boolean}
 */
export const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true; // If we can't access window.top, we're likely in an iframe
  }
};

/**
 * Get storage status for debugging
 * @returns {Object}
 */
export const getStorageStatus = () => {
  return {
    storageType: storageManager.getStorageType(),
    isInIframe: isInIframe(),
    hasUserId: !!storageManager.getItem('userId'),
    hasOrgId: !!storageManager.getItem('orgId'),
    hasUserData: !!storageManager.getItem('userData')
  };
};

/**
 * Storage utility with fallback for private browsing mode
 * Handles cases where localStorage is not available (private mode, incognito, etc.)
 */

class StorageManager {
  constructor() {
    this.memoryStorage = new Map();
    this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
  }

  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  checkLocalStorageAvailability() {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('localStorage is not available, using memory storage as fallback');
      return false;
    }
  }

  /**
   * Set item in storage (localStorage or memory fallback)
   * @param {string} key 
   * @param {string} value 
   */
  setItem(key, value) {
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.setItem(key, value);
      } else {
        this.memoryStorage.set(key, value);
      }
    } catch (e) {
      console.warn(`Failed to set item ${key} in localStorage, using memory storage:`, e);
      this.memoryStorage.set(key, value);
    }
  }

  /**
   * Get item from storage (localStorage or memory fallback)
   * @param {string} key 
   * @returns {string|null}
   */
  getItem(key) {
    try {
      if (this.isLocalStorageAvailable) {
        return localStorage.getItem(key);
      } else {
        return this.memoryStorage.get(key) || null;
      }
    } catch (e) {
      console.warn(`Failed to get item ${key} from localStorage, trying memory storage:`, e);
      return this.memoryStorage.get(key) || null;
    }
  }

  /**
   * Remove item from storage (localStorage or memory fallback)
   * @param {string} key 
   */
  removeItem(key) {
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.removeItem(key);
      } else {
        this.memoryStorage.delete(key);
      }
    } catch (e) {
      console.warn(`Failed to remove item ${key} from localStorage, using memory storage:`, e);
      this.memoryStorage.delete(key);
    }
  }

  /**
   * Clear all storage
   */
  clear() {
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.clear();
      } else {
        this.memoryStorage.clear();
      }
    } catch (e) {
      console.warn('Failed to clear localStorage, clearing memory storage:', e);
      this.memoryStorage.clear();
    }
  }

  /**
   * Get storage type currently in use
   * @returns {string}
   */
  getStorageType() {
    return this.isLocalStorageAvailable ? 'localStorage' : 'memory';
  }
}

// Create singleton instance
const storageManager = new StorageManager();

export default storageManager;

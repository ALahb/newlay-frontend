/**
 * Utility functions for handling URL parameters in iframe integration
 */

/**
 * Get URL parameters from the current URL
 * @returns {Object} Object containing userId and organizationId
 */
export const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        userId: urlParams.get('userId'),
        organizationId: urlParams.get('organizationId')
    };
};

/**
 * Build iframe URL with parameters
 * @param {string} baseUrl - Base URL of your React app
 * @param {string} userId - User ID
 * @param {string} organizationId - Organization ID
 * @returns {string} Complete URL with parameters
 */
export const buildIframeUrl = (baseUrl, userId, organizationId) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (organizationId) params.append('organizationId', organizationId);
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Example usage for parent page:
 * 
 * // In the parent page HTML/JavaScript:
 * const iframeUrl = buildIframeUrl(
 *     'http://localhost:3000/newlay/',
 *     '676301e1818b3e9f34f20fc2',
 *     '5a4db4c32d7f2fc398abd870'
 * );
 * 
 * // Then use this URL in your iframe src
 * <iframe src={iframeUrl} width="100%" height="800"></iframe>
 */ 
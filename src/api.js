import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// AWS API endpoints
const awsApi = axios.create({
    baseURL: 'http://localhost:5000/api/aws',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Get access token
export const getAccessToken = async () => {
    try {
        const response = await awsApi.get('/access-token');
        return response.data;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
};

// Get organization details
export const getOrganizationDetails = async (organizationId) => {
    try {
        const response = await awsApi.get(`/organization-details?organization_id=${organizationId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching organization details:', error);
        throw error;
    }
};

// Get user details
export const getUserDetails = async (userId) => {
    try {
        const response = await awsApi.get(`/user-details?user_id=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

// Get all organizations
export const getAllOrganizations = async () => {
    try {
        const response = await awsApi.get('/organizations');
        return response.data;
    } catch (error) {
        console.error('Error fetching all organizations:', error);
        throw error;
    }
};

// Get all modality request types
export const getAllModalityRequestTypes = async () => {
    try {
        const response = await awsApi.get('/modality-request-types');
        return response.data;
    } catch (error) {
        console.error('Error fetching modality request types:', error);
        throw error;
    }
};

export default api;

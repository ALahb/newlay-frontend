import axios from 'axios';

const api = axios.create({
    baseURL: 'https://radgate.rology.net/api',
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
    },
});

// AWS API endpoints
const awsApi = axios.create({
    baseURL: 'https://radgate.rology.net/api/aws',
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
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

// Update clinic request status
export const updateClinicRequestStatus = async (id, status) => {
    try {
        const response = await api.patch(`/clinic-requests/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating clinic request status:', error);
        throw error;
    }
};

// Upload report file to a clinic request
export const uploadClinicRequestReport = async (id, url_file) => {
    try {
        const response = await api.post(`/clinic-requests/${id}/report`, { url_file });
        return response.data;
    } catch (error) {
        console.error('Error uploading clinic request report:', error);
        throw error;
    }
};

// Create AWS case details
export const createAwsCaseDetails = async ({ src_org_id, dest_org_id, patient_id, radgate_id }) => {
    try {
        const response = await api.post('/aws/case-details', { src_org_id, dest_org_id, patient_id, radgate_id });
        return response.data;
    } catch (error) {
        console.error('Error creating AWS case details:', error);
        throw error;
    }
};

export default api;

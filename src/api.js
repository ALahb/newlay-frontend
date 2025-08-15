import axios from 'axios';

const api = axios.create({
    baseURL: 'https://radgateapi.rology.net/api',
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
    },
});

// AWS API endpoints
const awsApi = axios.create({
    baseURL: 'https://radgateapi.rology.net/api/aws',
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
    },
});

// Helper function to send push notifications
const sendNotificationToOrganization = async (organizationId, message, userInfo = null, requestId = null) => {
    try {
        const payload = { 
            organization_id: organizationId, 
            notification: message,
            user_type: userInfo?.type || 'unknown',
            request_id: requestId
        };
        await api.post('/aws/push-notification', payload);
    } catch (error) {
        console.error('Error sending push notification:', error);
        // Don't throw error to avoid breaking main functionality
    }
};

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
export const updateClinicRequestStatus = async (id, status, userInfo = null) => {
    try {
        const response = await api.patch(`/clinic-requests/${id}/status`, { status });
        
        // Send push notification to receiver clinic about status change
        if (response.data && response.data.request?.clinic_receiver_id) {
            const statusMessages = {
                'pending': 'A new request is pending for your organization.',
                'rejected': 'A request has been rejected for your organization.',
                'waiting_for_payment': 'A request is waiting for payment for your organization.',
                'ready_for_examination': 'A request is ready for examination for your organization.',
                'waiting_for_result': 'A request is waiting for results for your organization.',
                'finished': 'A request has been completed for your organization.'
            };
            
            const message = statusMessages[status] || `Request status has been updated to ${status} for your organization.`;
            await sendNotificationToOrganization(response.data.request?.clinic_receiver_id, message, userInfo, id);
        }
        
        return response.data;
    } catch (error) {
        console.error('Error updating clinic request status:', error);
        throw error;
    }
};

// Upload report file to a clinic request
export const uploadClinicRequestReport = async (id, url_file, userInfo = null) => {
    try {
        const response = await api.post(`/clinic-requests/${id}/report`, { url_file });
        
        // Send push notification to receiver clinic about report upload
        if (response.data && response.data.receiverClinic?.id) {
            await sendNotificationToOrganization(
                response.data.receiverClinic.id, 
                'A report has been uploaded for your organization.', 
                userInfo, 
                id
            );
        }
        
        return response.data;
    } catch (error) {
        console.error('Error uploading clinic request report:', error);
        throw error;
    }
};

// Create AWS case details
export const createAwsCaseDetails = async ({ src_org_id, dest_org_id, patient_id, radgate_id, accession_number }, userInfo = null) => {
    try {
        const response = await api.post('/aws/case-details', { src_org_id, dest_org_id, patient_id, radgate_id, accession_number });
        
        // Send push notification to destination organization about case details creation
        if (dest_org_id) {
            const message = accession_number 
                ? `Case details with accession number ${accession_number} have been created for your organization.`
                : 'Case details have been created for your organization.';
            await sendNotificationToOrganization(dest_org_id, message, userInfo, radgate_id);
        }
        
        return response.data;
    } catch (error) {
        console.error('Error creating AWS case details:', error);
        throw error;
    }
};

export const getReportUrl = async (radgate_id, userInfo = null, organizationId) => {
  try {
    const response = await awsApi.get(`/report-url?radgate_id=${radgate_id}`);    
    if (response.data && organizationId) {
      const message = `User ${userInfo?.name} has downloaded report.`;
      await sendNotificationToOrganization(
        organizationId,
        message,
        userInfo,
        radgate_id
      );
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching report URL:", error);
    throw error;
  }
};

// Send push notification
export const sendPushNotification = async (organization_id, notification, userInfo = null, request_id = null) => {
    try {
        const payload = { 
            organization_id, 
            notification,
            user_type: userInfo?.type || 'unknown',
            request_id
        };
        const response = await api.post('/aws/push-notification', payload);
        return response.data;
    } catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
    }
};

// Enhanced clinic request operations with push notifications
export const createClinicRequest = async (formData, userInfo = null) => {
    try {
        const response = await api.post('/clinic-requests', formData);
        
        // Send push notification to receiver clinic about new request
        const receiverClinicId = formData.get('clinic_receiver_id');
        if (receiverClinicId) {
            const patientName = formData.get('full_name') || 'Unknown Patient';
            await sendNotificationToOrganization(
                receiverClinicId, 
                `A new request has been created for your organization regarding patient ${patientName}`, 
                userInfo, 
                response.data?.id
            );
        }
        
        return response.data;
    } catch (error) {
        console.error('Error creating clinic request:', error);
        throw error;
    }
};

export const updateClinicRequest = async (id, data, userInfo = null) => {
    try {
        const response = await api.put(`/clinic-requests/${id}`, data);
        
        // Send push notification to receiver clinic about request update
        if (response.data && response.data.receiverClinic?.id) {
            await sendNotificationToOrganization(
                response.data.receiverClinic.id, 
                'A request has been updated for your organization.', 
                userInfo, 
                id
            );
        }
        
        return response.data;
    } catch (error) {
        console.error('Error updating clinic request:', error);
        throw error;
    }
};

export const getClinicRequest = async (id) => {
    try {
        const response = await api.get(`/clinic-requests/${id}`);                
        return response.data;
    } catch (error) {
        console.error('Error updating clinic request:', error);
        throw error;
    }
};

export const deleteClinicRequest = async (id, userInfo = null) => {
    try {
        // Get request details before deletion to send notification
        const requestResponse = await api.get(`/clinic-requests/${id}`);
        const requestData = requestResponse.data;
        
        const response = await api.delete(`/clinic-requests/${id}`);
        
        // Send push notification to receiver clinic about request deletion
        if (requestData && requestData.receiverClinic?.id) {
            await sendNotificationToOrganization(
                requestData.receiverClinic.id, 
                'A request has been deleted for your organization.', 
                userInfo, 
                id
            );
        }
        
        return response.data;
    } catch (error) {
        console.error('Error deleting clinic request:', error);
        throw error;
    }
};

export const processPaymentForRequest = async (id, paymentData, userInfo = null) => {
    try {
        const response = await api.put(`/clinic-requests/${id}/payment`, paymentData);        
        // Send push notification to receiver clinic about payment
        if (response.data && response.data.request.clinic_receiver_id) {
            const paymentType = `${paymentData.payment_type} payment` || 'payment';
            await sendNotificationToOrganization(
                response.data.request.clinic_receiver_id, 
                `A ${paymentType} has been processed for your organization.`, 
                userInfo, 
                id
            );
        }
        
        return response.data;
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
};

export default api;

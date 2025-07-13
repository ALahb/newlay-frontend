import React, { useState, useEffect } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Box, 
    CircularProgress, 
    Alert,
    Chip,
    Divider
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { getUserDetails, getOrganizationDetails } from '../api';

const UserOrganizationInfo = () => {
    const [userData, setUserData] = useState(null);
    const [organizationData, setOrganizationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    // Get IDs from URL parameters with fallback to default values
    const userId = searchParams.get('userId') || '676301e1818b3e9f34f20fc2';
    const organizationId = searchParams.get('organizationId') || '5a4db4c32d7f2fc398abd870';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch both user and organization data in parallel
                const [userResponse, organizationResponse] = await Promise.all([
                    getUserDetails(userId),
                    getOrganizationDetails(organizationId)
                ]);

                setUserData(userResponse);
                setOrganizationData(organizationResponse);
            } catch (err) {
                setError('Failed to fetch data. Please check your backend server.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, organizationId]); // Re-fetch when IDs change

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                User & Organization Information
            </Typography>
            
            {/* Display current IDs being used */}
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    <strong>Current User ID:</strong> {userId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Current Organization ID:</strong> {organizationId}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    To change these IDs, add ?userId=YOUR_USER_ID&organizationId=YOUR_ORG_ID to the URL
                </Typography>
            </Box>
            
            <Grid container spacing={3}>
                {/* User Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary">
                                User Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            {userData && userData.status === 'success' ? (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>User ID:</strong> {userId}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Status:</strong> 
                                        <Chip 
                                            label={userData.status === 'success' ? 'Success' : 'Error'} 
                                            color={userData.status === 'success' ? 'success' : 'error'}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Message:</strong> {userData.data || 'N/A'}
                                    </Typography>
                                    
                                    {userData.message && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                User Data:
                                            </Typography>
                                            <pre style={{ 
                                                backgroundColor: '#f5f5f5', 
                                                padding: '8px', 
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                overflow: 'auto'
                                            }}>
                                                {JSON.stringify(userData.message, null, 2)}
                                            </pre>
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                <Typography color="error">
                                    Failed to load user data
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Organization Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary">
                                Organization Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            {organizationData && organizationData.status === 'success' ? (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Organization ID:</strong> {organizationId}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Status:</strong> 
                                        <Chip 
                                            label={organizationData.status === 'success' ? 'Success' : 'Error'} 
                                            color={organizationData.status === 'success' ? 'success' : 'error'}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Message:</strong> {organizationData.data || 'N/A'}
                                    </Typography>
                                    
                                    {organizationData.message && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Organization Data:
                                            </Typography>
                                            <pre style={{ 
                                                backgroundColor: '#f5f5f5', 
                                                padding: '8px', 
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                overflow: 'auto'
                                            }}>
                                                {JSON.stringify(organizationData.message, null, 2)}
                                            </pre>
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                <Typography color="error">
                                    Failed to load organization data
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserOrganizationInfo; 
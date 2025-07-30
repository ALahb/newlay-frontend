import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Alert,
  Grid,
  Chip
} from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { getUrlParams } from '../utils/urlParams';

const UserDetails = () => {
  const [userId, setUserId] = useState('');
  const [urlParams, setUrlParams] = useState({});
  const { user, loading, error, fetchUserDetails } = useUser();

  // Get URL parameters on component mount
  useEffect(() => {
    const params = getUrlParams();
    setUrlParams(params);
    
    // Auto-fill userId if it's in the URL
    if (params.userId && !userId) {
      setUserId(params.userId);
    }
  }, [userId]);

  const handleFetchUser = () => {
    if (userId.trim()) {
      fetchUserDetails(userId.trim());
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        User Details
      </Typography>
      
      {/* URL Parameters Display */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            URL Parameters
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {urlParams.userId && (
              <Chip 
                label={`User ID: ${urlParams.userId}`} 
                color="primary" 
                variant="outlined"
              />
            )}
            {urlParams.organizationId && (
              <Chip 
                label={`Organization ID: ${urlParams.organizationId}`} 
                color="secondary" 
                variant="outlined"
              />
            )}
            {!urlParams.userId && !urlParams.organizationId && (
              <Typography variant="body2" color="text.secondary">
                No URL parameters found
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleFetchUser}
                disabled={loading || !userId.trim()}
                sx={{ height: 40 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Fetch User'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {user && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            
            {/* Display user type prominently */}
            {user?.message?.user?.type && (
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={`User Type: ${user.message.user.type}`} 
                  color="success" 
                  variant="filled"
                  sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                />
              </Box>
            )}
            
            <Box sx={{ mt: 2 }}>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '16px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '14px'
              }}>
                {JSON.stringify(user, null, 2)}
              </pre>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default UserDetails; 
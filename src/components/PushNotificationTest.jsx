import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Alert,
  Grid
} from '@mui/material';
import { useClinicRequest } from '../contexts/ClinicRequestContext';
import { useUser } from '../contexts/UserContext';

const PushNotificationTest = () => {
  const { sendPushNotificationToOrg } = useClinicRequest();
  const { user } = useUser();

  const handleTestPushNotification = async () => {
    try {
      // Using a sample organization ID for testing
      const testOrgId = '59da901ab565ad96b7d78557';
      const notification = 'This is a test notification with user type information.';
      
      await sendPushNotificationToOrg(testOrgId, notification);
      alert('Push notification sent successfully! Check the console for details.');
    } catch (error) {
      console.error('Error sending push notification:', error);
      alert('Error sending push notification: ' + error.message);
    }
  };

  const getUserType = () => {
    return user?.message?.user?.type || 'Not available';
  };

  const getUserName = () => {
    return user?.message?.user?.name || 'Not available';
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Push Notification Test
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current User Information
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>User Type:</strong> {getUserType()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>User Name:</strong> {getUserName()}
              </Typography>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mb: 2 }}>
            When you send a push notification, the user type and name will be automatically included in the request payload.
          </Alert>

          <Button
            variant="contained"
            color="primary"
            onClick={handleTestPushNotification}
            disabled={!user}
          >
            Send Test Push Notification
          </Button>
          
          {!user && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              User information is not available. Please fetch user details first.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PushNotificationTest; 
import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { useAuthentication } from '../contexts/AuthenticationContext';
import { useOrganization } from '../contexts/OrganizationContext';

const AuthDebugInfo = () => {
  const { user, organizationId, userId, token, loading, error } = useAuthentication();
  const { orgaId } = useOrganization();

  return (
    <Card sx={{ mb: 2, bgcolor: 'grey.50' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Authentication Debug Info
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            label={`Loading: ${loading}`} 
            color={loading ? 'warning' : 'default'}
            size="small"
          />
          <Chip 
            label={`Has Error: ${!!error}`} 
            color={error ? 'error' : 'default'}
            size="small"
          />
          <Chip 
            label={`Has Token: ${!!token}`} 
            color={token ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          <strong>Auth Context:</strong>
        </Typography>
        <Typography variant="body2" sx={{ ml: 1 }}>
          User ID: {userId || 'Not available'}
        </Typography>
        <Typography variant="body2" sx={{ ml: 1 }}>
          Organization ID: {organizationId || 'Not available'}
        </Typography>
        <Typography variant="body2" sx={{ ml: 1 }}>
          User Data: {user ? 'Available' : 'Not available'}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Organization Context:</strong>
        </Typography>
        <Typography variant="body2" sx={{ ml: 1 }}>
          Organization ID: {orgaId || 'Not available'}
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            <strong>Error:</strong> {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthDebugInfo;

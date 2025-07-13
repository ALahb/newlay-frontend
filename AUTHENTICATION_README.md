# Authentication System Implementation

This project now includes a complete authentication system that integrates with AWS Cognito and API Gateway.

## Features

- **Automatic Token Management**: Tokens are automatically retrieved and cached
- **Token Expiry Handling**: Tokens are refreshed before they expire
- **API Integration**: All API calls automatically include authentication headers
- **User Context**: User data is available throughout the application
- **Error Handling**: Comprehensive error handling for authentication failures

## Architecture

### Services

1. **`src/services/authService.js`**
   - Handles token retrieval from AWS Cognito
   - Manages token caching and expiry
   - Provides authentication headers

2. **`src/services/apiService.js`**
   - Wraps axios with automatic token injection
   - Handles API calls to AWS API Gateway
   - Includes request/response interceptors

### Context

3. **`src/contexts/UserContext.js`**
   - Manages user state throughout the application
   - Provides user data to all components
   - Handles user data fetching and caching

### Components

4. **`src/components/UserInfo.jsx`**
   - Displays user information in a card format
   - Shows loading states and error handling

5. **`src/components/TokenStatus.jsx`**
   - Testing component to verify authentication
   - Shows token status and API connectivity

## Configuration

The authentication system is configured with the following AWS Cognito settings:

```javascript
const COGNITO_CONFIG = {
  tokenUrl: 'https://us-east-1lysuhwklo.auth.us-east-1.amazoncognito.com/oauth2/token',
  clientId: 'ad8m6cfe0b6fvof2gpetht816',
  clientSecret: 'bfbij5f038accl5o47j5ej4jrbmsls3icio4oq4t5sn28c6c00f',
  scope: 'default-m2m-resource-server-kyuiv7/read'
};
```

## Usage

### Making Authenticated API Calls

```javascript
import apiService from './services/apiService';

// Get user details
const userData = await apiService.getUserDetails('676301e1818b3e9f34f20fc2');

// Generic API calls
const data = await apiService.get('/some-endpoint');
const result = await apiService.post('/some-endpoint', { data });
```

### Using User Context

```javascript
import { useUser } from './contexts/UserContext';

function MyComponent() {
  const { user, loading, error, fetchUserDetails } = useUser();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Manual Token Management

```javascript
import authService from './services/authService';

// Get token manually
const token = await authService.getToken();

// Get auth headers
const headers = authService.getAuthHeaders();

// Clear token (force refresh)
authService.clearToken();
```

## API Endpoints

The system is configured to work with the following API Gateway endpoint:

- **Base URL**: `https://nhbri5o0bi.execute-api.us-east-1.amazonaws.com/Stage`
- **User Details**: `/info/user_details?user_id=676301e1818b3e9f34f20fc2`

## Testing

The `TokenStatus` component provides a testing interface to:

1. Test token retrieval from AWS Cognito
2. Test API connectivity with the retrieved token
3. View token information (first 20 characters)
4. Monitor authentication status

## Error Handling

The system includes comprehensive error handling:

- **Token Retrieval Errors**: Logged and displayed to user
- **API Call Errors**: Automatic token refresh on 401 errors
- **Network Errors**: Graceful degradation with user feedback
- **Invalid Responses**: Proper error messages and fallbacks

## Security Considerations

- Tokens are stored in memory only (not localStorage)
- Tokens are automatically refreshed before expiry
- Sensitive credentials are in code (consider environment variables for production)
- All API calls include proper authentication headers

## Next Steps

For production deployment, consider:

1. Moving credentials to environment variables
2. Implementing token refresh logic
3. Adding user logout functionality
4. Implementing role-based access control
5. Adding session management 
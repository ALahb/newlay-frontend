import React, { useState, useEffect } from "react";
import { Container, Typography, Box, ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClinicRequests from "./pages/ClinicRequests";
import AddRequestPage from "./pages/AddRequestPage";
import EditRequestPage from "./pages/PreviewRequestPage";
import { ClinicRequestProvider } from "./contexts/ClinicRequestContext";
import { OrganizationProvider, useOrganization } from "./contexts/OrganizationContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import PaymentPage from "./pages/PaymentPage";
import { getOrganizationDetails } from "./api";
import { getUserTheme, getUserType } from "./utils/userTheme";
import BreadcrumbsNav from "./components/BreadcrumbsNav";
import { jwtDecode } from "jwt-decode";

function ThemedApp() {
  const { user } = useUser();
  const { orgaId } = useOrganization();
  const [clinicProviderName, setClinicProviderName] = useState(null);

  useEffect(() => {
    if (!orgaId) {
      setClinicProviderName(null);
      return;
    }
    getOrganizationDetails(orgaId).then(res => {
      setClinicProviderName(res.message?.organization?.name);
      console.log('clinicProviderName', res.message?.organization?.name);
    });
  }, [orgaId]);

  const userType = getUserType(user);
  const theme = getUserTheme(userType);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        {userType && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            mb: 2,
            position: 'relative'
          }}>
            <Box sx={{
              px: 2,
              py: 1,
              borderRadius: '20px',
              background: userType.toLowerCase() === 'doctor' 
                ? 'linear-gradient(45deg, #1976d2, #42a5f5)' 
                : userType.toLowerCase() === 'technician' || userType.toLowerCase() === 'tech'
                ? 'linear-gradient(45deg, #ff9800, #ffb74d)'
                : 'linear-gradient(45deg, #3f51b5, #7986cb)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textTransform: 'capitalize',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                borderRadius: '22px',
                background: userType.toLowerCase() === 'doctor' 
                  ? 'linear-gradient(45deg, #1565c0, #1976d2)' 
                  : userType.toLowerCase() === 'technician' || userType.toLowerCase() === 'tech'
                  ? 'linear-gradient(45deg, #f57c00, #ff9800)'
                  : 'linear-gradient(45deg, #303f9f, #3f51b5)',
                zIndex: -1,
              }
            }}>
              {userType} Mode
            </Box>
          </Box>
        )}

        <Typography variant="h4" gutterBottom>
          Clinic Management Dashboard
        </Typography>

        {clinicProviderName && (
          <Typography variant="h4" component="h2" sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'primary.main', mb: 2 }} gutterBottom>
            Clinic Provider : { clinicProviderName }
          </Typography>
        )}

        <BreadcrumbsNav />  

        <Routes>
          <Route path="/newlay" element={<ClinicRequests />} />
          <Route
            path="/newlay/clinicrequests/add"
            element={<AddRequestPage />}
          />
          <Route
            path="/newlay/clinicrequests/edit/:id"
            element={<EditRequestPage />}
          />
          <Route
            path="/newlay/clinicrequests/payment/:id"
            element={<PaymentPage />}
          />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

function App() {
  const [userId, setUserId] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      // Optionally validate event.origin here against an allowlist
      const data = event?.data;
      if (!data) return;

      // Case 1: Explicit token message
      if (data.type === 'idToken' && data.token) {
        try {
          const decoded = jwtDecode(data.token);
          setUserId(
            decoded['custom:rology_user'] ||
            decoded['sub'] ||
            decoded['userId'] ||
            decoded['user_id']
          );
          setOrganizationId(
            decoded['custom:organizationId'] ||
            decoded['organizationId'] ||
            decoded['orgId'] ||
            decoded['organization_id']
          );
        } catch (error) {
          console.error('Failed to decode JWT:', error);
        }
        return;
      }

      // Case 2: Bare token without type
      if (data.token && typeof data.token === 'string') {
        try {
          const decoded = jwtDecode(data.token);
          setUserId(
            decoded['custom:rology_user'] ||
            decoded['sub'] ||
            decoded['userId'] ||
            decoded['user_id']
          );
          setOrganizationId(
            decoded['custom:organizationId'] ||
            decoded['organizationId'] ||
            decoded['orgId'] ||
            decoded['organization_id']
          );
        } catch (error) {
          console.error('Failed to decode JWT:', error);
        }
        return;
      }

      // Case 3: Parent sends plain IDs or a different type
      if (
        (data.type === 'AUTH' || data.type === 'AUTH_INFO' || !data.type) &&
        (data.userId || data.user_id) &&
        (data.organizationId || data.orgId || data.organization_id)
      ) {
        setUserId(data.userId || data.user_id);
        setOrganizationId(data.organizationId || data.orgId || data.organization_id);
        return;
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Fallback: read from URL params if present
    try {
      const params = new URLSearchParams(window.location.search);
      const urlUserId = params.get('userId');
      const urlOrgId = params.get('organizationId');
      if (urlUserId) {
        setUserId(urlUserId);
      }
      if (urlOrgId) {
        setOrganizationId(urlOrgId);
      }
    } catch (_) {}

    // Initiate handshake with parent to request token
    try {
      const request = { type: 'REQUEST_ID_TOKEN' };
      // Send immediately and after a short delay to cover race conditions
      window.parent?.postMessage(request, '*');
      const retryTimer = setTimeout(() => {
        window.parent?.postMessage(request, '*');
      }, 500);

      return () => {
        window.removeEventListener('message', handleMessage);
        clearTimeout(retryTimer);
      };
    } catch (_) {
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  return (
    userId ? (
      <UserProvider userId={userId}>
        <ClinicRequestProvider>
          <Router>
            <OrganizationProvider organizationId={organizationId}>
              <ThemedApp />
            </OrganizationProvider>
          </Router>
        </ClinicRequestProvider>
      </UserProvider>
    ) : (
      <div>
        <h2>Waiting for authentication...</h2>
        <p>Please ensure you are logged in through the main application.</p>
      </div>
    )
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClinicRequests from "./pages/ClinicRequests";
import AddRequestPage from "./pages/AddRequestPage";
import EditRequestPage from "./pages/PreviewRequestPage";
import { ClinicRequestProvider } from "./contexts/ClinicRequestContext";
import { OrganizationProvider } from "./contexts/OrganizationContext";
import { UserProvider } from "./contexts/UserContext";
import PaymentPage from "./pages/PaymentPage";
import { getOrganizationDetails } from "./api";

function App() {

  const [clinicProviderName, setClinicProviderName] = useState(null);

  useEffect(() => {
    getOrganizationDetails(localStorage.getItem('orgId')).then(res => {
        setClinicProviderName(res.message?.organization?.name);
        console.log('clinicProviderName', res.message?.organization?.name);
        
    });
}, [localStorage.getItem('orgId')]);

  return (
    <UserProvider>
    <ClinicRequestProvider>
      <Router>
        <OrganizationProvider>
          
            <Container maxWidth="lg" sx={{ mt: 5 }}>
              <Typography variant="h4" gutterBottom>
                Clinic Management Dashboard
              </Typography>

              {clinicProviderName && (
                <Typography variant="h4" component="h2" sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'primary.main', mb: 2 }} gutterBottom>
                  Clinic Provider : { clinicProviderName }
                </Typography>
              )}


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
         
        </OrganizationProvider>
      </Router>
    </ClinicRequestProvider>
    </UserProvider>
  );
}

export default App;

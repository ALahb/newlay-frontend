import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClinicRequests from "./pages/ClinicRequests";
import AddRequestPage from "./pages/AddRequestPage";
import EditRequestPage from "./pages/PreviewRequestPage";
import { ClinicRequestProvider } from "./contexts/ClinicRequestContext";
import { OrganizationProvider } from "./contexts/OrganizationContext";
import PaymentPage from "./pages/PaymentPage";
import UserOrganizationInfo from "./components/UserOrganizationInfo";

function App() {
  return (
    <ClinicRequestProvider>
      <Router>
        <OrganizationProvider>
          <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
              Clinic Management Dashboard
            </Typography>

            {/* User & Organization Information */}
            {/*  <UserOrganizationInfo />*/}

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
  );
}

export default App;

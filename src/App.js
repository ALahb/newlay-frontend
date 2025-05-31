import React from 'react';
import { Container, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClinicRequests from './pages/ClinicRequests';
import AddRequestPage from './pages/AddRequestPage';
import EditRequestPage from './pages/EditRequestPage';
import { ClinicRequestProvider } from './contexts/ClinicRequestContext';

function App() {
  return (
    <ClinicRequestProvider>
      <Router>
        <Container maxWidth="lg" sx={{ mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Clinic Management Dashboard
          </Typography>
          <Routes>
            <Route path="/" element={<ClinicRequests />} />
            <Route path="/clinicrequests/add" element={<AddRequestPage />} />
            <Route path="/clinicrequests/edit/:id" element={<EditRequestPage />} />
          </Routes>
        </Container>
      </Router>
    </ClinicRequestProvider>
  );
}

export default App;

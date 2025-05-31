import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClinicRequests from './pages/ClinicRequests';
import AddRequestPage from './pages/AddRequestPage';
import EditRequestPage from './pages/EditRequestPage';

const initialData = [
  {
    id: 1,
    patientName: 'John Doe',
    nationalityId: '123456789',
    client: 'Clinic A',
    provider: 'Provider A',
    status: 'Pending',
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    nationalityId: '987654321',
    client: 'Clinic B',
    provider: 'Provider B',
    status: 'Approved',
  },
];

function App() {
  const [requests, setRequests] = useState(initialData);

  return (
    <Router>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Clinic Management Dashboard
        </Typography>
        <Routes>
          <Route path="/" element={<ClinicRequests requests={requests} setRequests={setRequests} />} />
          <Route path="/clinicrequests/add" element={<AddRequestPage setRequests={setRequests} />} />
          <Route
            path="/clinicrequests/edit/:id"
            element={
              <EditRequestPage requests={requests} setRequests={setRequests} />
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

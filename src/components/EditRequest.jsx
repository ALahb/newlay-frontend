import React, { useState } from 'react';
import {
    TextField,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Select,
    MenuItem,
    InputLabel,
    Typography,
} from '@mui/material';

export default function EditRequest({ initialData, onSubmit }) {
    const [formData, setFormData] = useState({
        patientName: initialData.patientName || '',
        nationalityId: initialData.nationalityId || '',
        client: initialData.client || '',
        provider: initialData.provider || '',
        status: initialData.status || '',
        phone: initialData.phone || '',
        emergency: initialData.emergency || 'No',
        ivContrast: initialData.ivContrast || 'No',
        previousOperation: initialData.previousOperation || 'No',
        previousOperationNote: initialData.previousOperationNote || '',
        receivedMedication: initialData.receivedMedication || 'No',
        receivedMedicationNote: initialData.receivedMedicationNote || '',
        referralDoctor: initialData.referralDoctor || '',
        oldStudyComparison: initialData.oldStudyComparison || 'No',
        complaintHistory: initialData.complaintHistory || '',
        price: initialData.price || '',
        paymentType: initialData.paymentType || 'Cash',
        requestType: initialData.requestType || [],
        hospital: initialData.hospital || '',
    });

    // Gestion des changements sur les inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'requestType') {
            // Pour multi-select MUI, e.target.value est un tableau
            setFormData((prev) => ({ ...prev, [name]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, mx: 'auto' }}>
            <Typography variant="h6" mb={2}>
                Edit Request
            </Typography>

            <TextField
                label="Patient Name"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />

            <TextField
                label="Nationality ID"
                name="nationalityId"
                value={formData.nationalityId}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />

            <FormControl fullWidth margin="normal">
                <InputLabel id="client-label">Clinic</InputLabel>
                <Select
                    labelId="client-label"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    label="Clinic"
                    required
                >
                    <MenuItem value="Clinic A">Clinic A</MenuItem>
                    <MenuItem value="Clinic B">Clinic B</MenuItem>
                    <MenuItem value="Clinic C">Clinic C</MenuItem>
                </Select>
            </FormControl>

            <TextField
                label="Provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            {/* Request Type multi-select */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="request-type-label">Request Type</InputLabel>
                <Select
                    labelId="request-type-label"
                    name="requestType"
                    multiple
                    value={formData.requestType}
                    onChange={handleChange}
                    label="Request Type"
                >
                    <MenuItem value="Radio">Radio</MenuItem>
                    <MenuItem value="IRM">IRM</MenuItem>
                    <MenuItem value="Eco">Eco</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel id="hospital-label">Hospital</InputLabel>
                <Select
                    labelId="hospital-label"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    label="Hospital"
                >
                    <MenuItem value="Clinic Zayatine">Clinic Zayatine</MenuItem>
                    <MenuItem value="Clinic Pasteur">Clinic Pasteur</MenuItem>
                </Select>
            </FormControl>

            {/* Radios pour Emergency */}
            <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Emergency?</FormLabel>
                <RadioGroup
                    row
                    name="emergency"
                    value={formData.emergency}
                    onChange={handleChange}
                >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
            </FormControl>

            {/* Radios pour IV Contrast */}
            <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">With IV Contrast?</FormLabel>
                <RadioGroup
                    row
                    name="ivContrast"
                    value={formData.ivContrast}
                    onChange={handleChange}
                >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
            </FormControl>

            {/* Previous Operation */}
            <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Previous Operation(s)?</FormLabel>
                <RadioGroup
                    row
                    name="previousOperation"
                    value={formData.previousOperation}
                    onChange={handleChange}
                >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
                <TextField
                    label="Please specify previous operation and date"
                    name="previousOperationNote"
                    value={formData.previousOperationNote}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    margin="normal"
                />
            </FormControl>

            {/* Received Medication */}
            <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Received Medication(s)?</FormLabel>
                <RadioGroup
                    row
                    name="receivedMedication"
                    value={formData.receivedMedication}
                    onChange={handleChange}
                >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
                <TextField
                    label="Please specify received medication with dates"
                    name="receivedMedicationNote"
                    value={formData.receivedMedicationNote}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    margin="normal"
                />
            </FormControl>

            <TextField
                label="Referral Doctor"
                name="referralDoctor"
                value={formData.referralDoctor}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            {/* Old Study Comparison */}
            <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Old study for comparison?</FormLabel>
                <RadioGroup
                    row
                    name="oldStudyComparison"
                    value={formData.oldStudyComparison}
                    onChange={handleChange}
                >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
            </FormControl>

            <TextField
                label="Complaint and past history"
                name="complaintHistory"
                value={formData.complaintHistory}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                margin="normal"
            />

            {/* Price */}
            <TextField
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            {/* Payment Type Radios */}
            <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Payment Type</FormLabel>
                <RadioGroup
                    row
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleChange}
                >
                    <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
                    <FormControlLabel value="Online" control={<Radio />} label="Online" />
                    <FormControlLabel value="Credit" control={<Radio />} label="Credit" />
                </RadioGroup>
            </FormControl>

            <Box textAlign="right" mt={3}>
                <Button variant="contained" color="primary" type="submit">
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
}

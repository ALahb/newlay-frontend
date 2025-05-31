import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Select,
    MenuItem,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextareaAutosize,
    Button,
    InputLabel,
    OutlinedInput,
    Chip,
} from '@mui/material';

const clinicsExample = [
    { id: '1', name: 'Clinic 1' },
    { id: '2', name: 'Clinic 2' },
];
const requestTypes = ['Radio', 'IRM', 'Eco', 'N/A'];
const hospitals = ['Clinic Zayatine', 'Clinic Pasteur', 'Bilateral', 'N/A'];

export default function AddRequestForm() {
    // États
    const [nationalityId, setNationalityId] = useState('');
    const [clinic, setClinic] = useState('');
    const [requestType, setRequestType] = useState([]);
    const [hospital, setHospital] = useState('');
    const [phone, setPhone] = useState('');
    const [emergency, setEmergency] = useState('yes');
    const [ivContrast, setIvContrast] = useState('yes');
    const [previousOperation, setPreviousOperation] = useState('yes');
    const [previousOperationNote, setPreviousOperationNote] = useState('');
    const [receivedMedication, setReceivedMedication] = useState('yes');
    const [receivedMedicationNote, setReceivedMedicationNote] = useState('');
    const [referralDoctor, setReferralDoctor] = useState('');
    const [oldStudy, setOldStudy] = useState('yes');
    const [complaint, setComplaint] = useState('');
    const [file, setFile] = useState(null);
    const [price, setPrice] = useState('');
    const [paymentType, setPaymentType] = useState('cash');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: envoyer les données au backend
        const formData = {
            nationalityId,
            clinic,
            requestType,
            hospital,
            phone,
            emergency,
            ivContrast,
            previousOperation,
            previousOperationNote,
            receivedMedication,
            receivedMedicationNote,
            referralDoctor,
            oldStudy,
            complaint,
            file,
            price,
            paymentType,
        };
        console.log(formData);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 4, px: 2 }}
        >
            {/* Patient Check Card */}
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Check Patient Exist" />
                <CardContent>
                    <TextField
                        label="Nationality ID"
                        type="number"
                        required
                        fullWidth
                        value={nationalityId}
                        onChange={(e) => setNationalityId(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="clinic-label">Choose Clinic</InputLabel>
                        <Select
                            labelId="clinic-label"
                            value={clinic}
                            onChange={(e) => setClinic(e.target.value)}
                            label="Choose Clinic"
                            required
                        >
                            {clinicsExample.map((c) => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="success" type="submit">
                        Check Patient
                    </Button>
                </CardContent>
            </Card>

            {/* Request Details Card */}
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Request Details" />
                <CardContent>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="request-type-label">Request Type</InputLabel>
                        <Select
                            labelId="request-type-label"
                            multiple
                            value={requestType}
                            onChange={(e) => setRequestType(e.target.value)}
                            input={<OutlinedInput label="Request Type" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {requestTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="hospital-label">Hospital</InputLabel>
                        <Select
                            labelId="hospital-label"
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                            label="Hospital"
                        >
                            {hospitals.map((h) => (
                                <MenuItem key={h} value={h}>
                                    {h}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Phone Number"
                        fullWidth
                        sx={{ mb: 3 }}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <FormControl component="fieldset" sx={{ mb: 3 }}>
                        <FormLabel component="legend">Emergency?</FormLabel>
                        <RadioGroup
                            row
                            value={emergency}
                            onChange={(e) => setEmergency(e.target.value)}
                            name="emergency-radio"
                        >
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        </RadioGroup>
                    </FormControl>

                    <FormControl component="fieldset" sx={{ mb: 3 }}>
                        <FormLabel component="legend">With IV Contrast?</FormLabel>
                        <RadioGroup
                            row
                            value={ivContrast}
                            onChange={(e) => setIvContrast(e.target.value)}
                            name="ivcontrast-radio"
                        >
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Previous Operations Card */}
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Previous Operation(s)" />
                <CardContent>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <RadioGroup
                            row
                            value={previousOperation}
                            onChange={(e) => setPreviousOperation(e.target.value)}
                            name="previous-operation-radio"
                        >
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        </RadioGroup>
                    </FormControl>
                    <TextareaAutosize
                        minRows={3}
                        placeholder="Please specify previous operation and date"
                        style={{ width: '100%', padding: 8, fontSize: 16 }}
                        value={previousOperationNote}
                        onChange={(e) => setPreviousOperationNote(e.target.value)}
                    />
                </CardContent>
            </Card>

            {/* Received Medication Card */}
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Received Medication(s)" />
                <CardContent>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <RadioGroup
                            row
                            value={receivedMedication}
                            onChange={(e) => setReceivedMedication(e.target.value)}
                            name="received-medication-radio"
                        >
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        </RadioGroup>
                    </FormControl>
                    <TextareaAutosize
                        minRows={3}
                        placeholder="Please specify received medication with dates"
                        style={{ width: '100%', padding: 8, fontSize: 16 }}
                        value={receivedMedicationNote}
                        onChange={(e) => setReceivedMedicationNote(e.target.value)}
                    />
                </CardContent>
            </Card>

            {/* Referral Doctor */}
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Referral Doctor" />
                <CardContent>
                    <TextField
                        label="Doctor's Name"
                        fullWidth
                        value={referralDoctor}
                        onChange={(e) => setReferralDoctor(e.target.value)}
                    />
                </CardContent>
            </Card>

            {/* Old Study & Complaint */}
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Old Study & Complaint" />
                <CardContent>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">Old study for comparison?</FormLabel>
                        <RadioGroup
                            row
                            value={oldStudy}
                            onChange={(e) => setOldStudy(e.target.value)}
                            name="old-study-radio"
                        >
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        </RadioGroup>
                    </FormControl>

                    <TextareaAutosize
                        minRows={3}
                        placeholder="Please specify patient complaint and past history"
                        style={{ width: '100%', padding: 8, fontSize: 16, marginBottom: 16 }}
                        value={complaint}
                        onChange={(e) => setComplaint(e.target.value)}
                    />

                    <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                        Upload File
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    {file && <Box>Fichier sélectionné: {file.name}</Box>}
                </CardContent>
            </Card>

            {/* Price & Payment */}
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Price & Payment" />
                <CardContent>
                    <TextField
                        label="Price"
                        fullWidth
                        sx={{ mb: 3 }}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <FormControl component="fieldset" sx={{ mb: 3 }}>
                        <FormLabel component="legend">Payment Type</FormLabel>
                        <RadioGroup
                            row
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                            name="payment-type-radio"
                        >
                            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                            <FormControlLabel value="online" control={<Radio />} label="Online" />
                            <FormControlLabel value="credit" control={<Radio />} label="Credit" />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <Box textAlign="right">
                <Button variant="contained" color="primary" type="submit" sx={{ px: 5 }}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
}

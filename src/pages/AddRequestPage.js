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
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useClinicRequest } from '../contexts/ClinicRequestContext';

const clinicsExample = [
    { id: '1', name: 'Clinic 1' },
    { id: '2', name: 'Clinic 2' },
];
const requestTypes = ['Radio', 'IRM', 'Eco', 'N/A'];
const hospitals = ['Clinic Zayatine', 'Clinic Pasteur', 'Bilateral', 'N/A'];

export default function AddRequestForm() {

    const navigate = useNavigate();
    const { createRequest, checkPatientByNationality } = useClinicRequest();
    // États
    const [status, setStatus] = useState('');
    const [nationalityId, setNationalityId] = useState('');
    const [fullName, setFullName] = useState('');
    const [nationalityIdInRequest, setNationalityIdInRequest] = useState('');
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
    // Supprimé : const [price, setPrice] = useState('');
    // Supprimé : const [paymentType, setPaymentType] = useState('cash');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nationality_id', nationalityIdInRequest);
        formData.append('clinic_id', clinic);
        formData.append('request_types', JSON.stringify(requestType));
        formData.append('full_name', fullName);
        formData.append('phone', phone);
        formData.append('is_emergency', emergency === 'yes');
        formData.append('with_iv_contrast', ivContrast === 'yes');
        formData.append('has_previous_operations', previousOperation === 'yes');
        formData.append('previous_operations_details', previousOperationNote);
        formData.append('received_medications', receivedMedication === 'yes');
        formData.append('medications_details', receivedMedicationNote);
        formData.append('referral_doctor', referralDoctor);
        formData.append('has_old_study', oldStudy === 'yes');
        formData.append('complaint_history', complaint);
        if (file) formData.append('attachment_path', file);
        // Supprimé : formData.append('price', price);
        // Supprimé : formData.append('payment_type', paymentType);
        try {
            await createRequest(formData);
            navigate('/');
        } catch (error) {
            console.error('Erreur lors de la création de la requête', error);
        }
    };

    const checkPatient = async () => {
        setError('');
        setResult(null);

        if (!nationalityId || !clinic) {
            setError('Tous les champs sont requis.');
            return;
        }

        try {
            const response = await checkPatientByNationality(nationalityId);
            setResult(response);
            if (response) {
                setFullName(response.full_name || '');
                setNationalityIdInRequest(response.nationality_id || '');
            }
        } catch (err) {
            setError("Erreur lors de la vérification du patient.");
        }
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
                    <Button
                        variant="contained"
                        color="success"
                        onClick={checkPatient}
                        disabled={!nationalityId || !clinic}
                    >
                        Check Patient
                    </Button>

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                    {result && (
                        <Card sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5' }}>
                            <Typography><strong>Full Name :</strong> {result.full_name}</Typography>
                            <Typography><strong>Nationality ID :</strong> {result.nationality_id}</Typography>
                            <Typography><strong>Doctor :</strong> {result.referral_doctor}</Typography>
                        </Card>
                    )}
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

                    <TextField
                        label="Full Name"
                        fullWidth
                        sx={{ mb: 3 }}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <TextField
                        label="Nationality ID"
                        type="number"
                        fullWidth
                        sx={{ mb: 3 }}
                        value={nationalityIdInRequest}
                        onChange={(e) => setNationalityIdInRequest(e.target.value)}
                    />

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

            {/* Submit Button */}
            <Box textAlign="right">
                <Button variant="contained" color="primary" type="submit" sx={{ px: 5 }}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
}

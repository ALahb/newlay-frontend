import React, { useState, useEffect } from 'react';
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
    CircularProgress,
    Alert,
    Autocomplete
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useClinicRequest } from '../contexts/ClinicRequestContext';
import { getAllOrganizations, getAllModalityRequestTypes, getOrganizationDetails } from '../api';
import { useOrganization } from '../contexts/OrganizationContext';
import { useUser } from '../contexts/UserContext';

export default function AddRequestForm() {
    const navigate = useNavigate();
    const { createRequest, sendPushNotificationToOrg } = useClinicRequest();
    const { orgaId } = useOrganization();
    const { user } = useUser();

    const [fullName, setFullName] = useState('');
    const [nationalityIdInRequest, setNationalityIdInRequest] = useState('');
    const [clinicProvider, setClinicProvider] = useState(orgaId || '');
    const [clinicProviderName, setClinicProviderName] = useState('');
    const [clinicReceiver, setClinicReceiver] = useState('');
    // Change requestType to a single value (string)
    const [requestType, setRequestType] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    // Set default to "no" for all radio button states
    const [emergency, setEmergency] = useState('no');
    const [ivContrast, setIvContrast] = useState('no');
    const [previousOperation, setPreviousOperation] = useState('no');
    const [previousOperationNote, setPreviousOperationNote] = useState('');
    const [receivedMedication, setReceivedMedication] = useState('no');
    const [receivedMedicationNote, setReceivedMedicationNote] = useState('');
    const [referralDoctor, setReferralDoctor] = useState('');
    const [oldStudy, setOldStudy] = useState('no');
    const [complaint, setComplaint] = useState('');

    const [organizations, setOrganizations] = useState([]);
    const [requestTypes, setRequestTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState('');

    // Loader for form submission
    const [submitting, setSubmitting] = useState(false);

    // Flattened list of request type options for the select
    const [requestTypeOptions, setRequestTypeOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setApiError('');

                const [orgsResponse, typesResponse] = await Promise.all([
                    getAllOrganizations(),
                    getAllModalityRequestTypes()
                ]);

                const providerId = organizationId || localStorage.getItem('orgId');

                if (orgsResponse && orgsResponse.data) {
                    const allOrgs = orgsResponse.message.data.result;
                    const filteredOrgs = allOrgs.filter(
                        org => org._id !== providerId
                    );
                    setOrganizations(filteredOrgs);
                } else {
                    console.warn('Organizations response format unexpected:', orgsResponse);
                    setOrganizations([]);
                }

                if (typesResponse && typesResponse.data) {
                    const types = typesResponse.message.data.result;
                    setRequestTypes(types);

                    // Flatten the request types for the select
                    const options = [];
                    types.forEach((modalityObj) => {
                        if (modalityObj.request_types && Array.isArray(modalityObj.request_types)) {
                            modalityObj.request_types.forEach((rt) => {
                                options.push({
                                    value: rt.value,
                                    label: `${modalityObj.modality} - ${rt.name}`,
                                });
                            });
                        }
                    });
                    setRequestTypeOptions(options);
                } else {
                    console.warn('Request types response format unexpected:', typesResponse);
                    setRequestTypes([]);
                    setRequestTypeOptions([]);
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setApiError('Failed to load organizations and request types. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orgaId]);

    useEffect(() => {
        if (orgaId) {
            setClinicProvider(orgaId);
        }

        if (!orgaId) return;
        getOrganizationDetails(orgaId).then(res => {
            setClinicProviderName(res.message?.organization?.name);
            console.log('clinicProviderName', res.message?.organization?.name);
        });
    }, [orgaId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);

        const formData = new FormData();
        formData.append('nationality_id', nationalityIdInRequest);
        formData.append('clinic_provider_id', clinicProvider);
        formData.append('clinic_receiver_id', clinicReceiver);
        formData.append('clinic_receiver_name', organizations.find(org => org._id === clinicReceiver)?.name || '');
        formData.append('clinic_provider_name', clinicProviderName);
        // Only submit a single value for request_types
        formData.append('request_types', requestType);
        formData.append('full_name', fullName);
        formData.append('birthday', birthday);
        formData.append('phone', phone);
        formData.append('is_emergency', emergency === 'yes' ? 'true' : 'false');
        formData.append('with_iv_contrast', ivContrast === 'yes' ? 'true' : 'false');
        formData.append('has_previous_operations', previousOperation === 'yes' ? 'true' : 'false');
        formData.append('previous_operations_details', previousOperationNote);
        formData.append('received_medications', receivedMedication === 'yes' ? 'true' : 'false');
        formData.append('medications_details', receivedMedicationNote);
        formData.append('referral_doctor', referralDoctor);
        formData.append('has_old_study', oldStudy === 'yes' ? 'true' : 'false');
        formData.append('complaint_history', complaint);
        formData.append('user_id', user?.message?.user?.id);
        
        try {
            const response = await createRequest(formData);
            console.log('response', response);
            
            // Push notification is now handled automatically in the API
            setTimeout(() => {
                navigate('/newlay/');
            }, 500);
        } catch (error) {
            console.error('Erreur lors de la création de la requête', error);
            setSubmitting(false);
        }
    };

    const [requestTypeSearch, setRequestTypeSearch] = useState('');
    const filteredRequestTypeOptions = requestTypeOptions.filter(option =>
        option.label.toLowerCase().includes(requestTypeSearch.toLowerCase())
    );

    const [hospitalSearch, setHospitalSearch] = useState('');
    const filteredOrganizations = organizations.filter(org =>
        (org.name || '').toLowerCase().includes(hospitalSearch.toLowerCase())
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (apiError) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 4, px: 2 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {apiError}
                </Alert>
                <Button 
                    variant="contained" 
                    onClick={() => window.location.reload()}
                    sx={{ mt: 2 }}
                >
                    Refresh Page
                </Button>
            </Box>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 4, px: 2 }}
        >
            {/* Overlay loader after form submission */}
            {submitting && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(255,255,255,0.7)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress size={60} />
                        <Box mt={2} fontSize={18} color="text.secondary">
                            Submitting request...
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Request Details Card */}
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Request Details" />
                <CardContent>
                    {/* Request Type with search */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <Autocomplete
                            options={requestTypeOptions}
                            getOptionLabel={(option) => option.label || ''}
                            value={requestTypeOptions.find(opt => opt.label === requestType) || null}
                            onChange={(_, newValue) => setRequestType(newValue ? newValue.label : '')}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Request Type"
                                    onChange={e => setRequestTypeSearch(e.target.value)}
                                    value={requestTypeSearch}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.label === value.label}
                            filterOptions={(options, state) => {
                                return options.filter(option =>
                                    option.label.toLowerCase().includes(state.inputValue.toLowerCase())
                                );
                            }}
                        />
                    </FormControl>

                    <TextField
                        label="Full Name"
                        fullWidth
                        sx={{ mb: 3 }}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <TextField
                        label="Birthday"
                        type="date"
                        fullWidth
                        sx={{ mb: 3 }}
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Nationality ID"
                        type="number"
                        fullWidth
                        sx={{ mb: 3 }}
                        value={nationalityIdInRequest}
                        onChange={(e) => setNationalityIdInRequest(e.target.value)}
                    />

                    {/* Hospital with search */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <Autocomplete
                            options={organizations}
                            getOptionLabel={(option) => option.name || ''}
                            value={organizations.find(opt => opt._id === clinicReceiver) || null}
                            onChange={(_, newValue) => setClinicReceiver(newValue ? newValue._id : '')}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Hospital"
                                    onChange={e => setHospitalSearch(e.target.value)}
                                    value={hospitalSearch}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            filterOptions={(options, state) => {
                                return options.filter(option =>
                                    (option.name || '').toLowerCase().includes(state.inputValue.toLowerCase())
                                );
                            }}
                        />
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
                </CardContent>
            </Card>

            {/* Submit Button */}
            <Box textAlign="right">
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ px: 5 }}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {submitting ? 'Submitting...' : 'Submit'}
                </Button>
            </Box>
        </Box>
    );
}

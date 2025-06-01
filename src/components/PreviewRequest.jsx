import React from 'react';
import {
    Box,
    Typography,
    Chip,
    Divider,
    Card,
    CardContent,
    Stack,
} from '@mui/material';

export default function PreviewRequest({ initialData }) {

    function boolToYesNo(value) {
        if (value === null || value === undefined) return '-';
        return value ? 'Yes' : 'No';
    }

    function formatRequestTypes(requestTypes) {
        if (!requestTypes) return [];

        if (typeof requestTypes === 'string') {
            try {
                const parsed = JSON.parse(requestTypes);
                if (Array.isArray(parsed)) return parsed;
                return [String(parsed)];
            } catch {
                return [requestTypes];
            }
        }
        if (Array.isArray(requestTypes)) return requestTypes;
        return [String(requestTypes)];
    }

    const requestTypesArray = formatRequestTypes(initialData.request_types);
    return (
        <Card sx={{ maxWidth: 700, mx: 'auto', p: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Request Preview
                </Typography>

                {/* Patient Info Section */}
                <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        Patient Information
                    </Typography>
                    <Divider />
                    <Typography variant="body2" color="textSecondary" mt={2}>
                        Patient Name
                    </Typography>
                    <Typography>{initialData?.Patient?.full_name || '-'}</Typography>

                    <Typography variant="body2" color="textSecondary" mt={1}>
                        Nationality ID
                    </Typography>
                    <Typography>{initialData?.Patient?.nationality_id || '-'}</Typography>

                    <Typography variant="body2" color="textSecondary" mt={1}>
                        Phone Number
                    </Typography>
                    <Typography>{initialData?.Patient?.phone || '-'}</Typography>
                </Box>

                {/* Clinics Section */}
                <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        Clinics
                    </Typography>
                    <Divider />
                    <Typography variant="body2" color="textSecondary" mt={2}>
                        Receiver Clinic
                    </Typography>
                    <Typography>{initialData?.receiverClinic?.name || '-'}</Typography>

                    <Typography variant="body2" color="textSecondary" mt={1}>
                        Provider Clinic
                    </Typography>
                    <Typography>{initialData?.providerClinic?.name || '-'}</Typography>
                </Box>

                {/* Request Details Section */}
                <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        Request Details
                    </Typography>
                    <Divider />
                    <Typography variant="body2" color="textSecondary" mt={2}>
                        Request Type
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                        {requestTypesArray.length > 0
                            ? requestTypesArray.map((type, index) => (
                                <Chip key={index} label={type} size="small" />
                            ))
                            : '-'}
                    </Stack>

                    <Typography variant="body2" color="textSecondary">
                        Emergency?
                    </Typography>
                    <Typography mb={2}>{boolToYesNo(initialData.is_emergency)}</Typography>

                    <Typography variant="body2" color="textSecondary">
                        With IV Contrast?
                    </Typography>
                    <Typography mb={2}>{boolToYesNo(initialData?.Patient?.with_iv_contrast)}</Typography>

                    <Typography variant="body2" color="textSecondary">
                        Previous Operation(s)?
                    </Typography>
                    <Typography mb={2}>{boolToYesNo(initialData?.Patient?.has_previous_operations)}</Typography>

                    {initialData?.Patient?.previous_operations_details && (
                        <>
                            <Typography variant="body2" color="textSecondary">
                                Details on Previous Operation
                            </Typography>
                            <Typography mb={2} sx={{ whiteSpace: 'pre-line' }}>
                                {initialData.Patient.previous_operations_details}
                            </Typography>
                        </>
                    )}

                    <Typography variant="body2" color="textSecondary">
                        Received Medication(s)?
                    </Typography>
                    <Typography mb={2}>{boolToYesNo(initialData?.Patient?.received_medications)}</Typography>

                    {initialData?.Patient?.medications_details && (
                        <>
                            <Typography variant="body2" color="textSecondary">
                                Details on Received Medication
                            </Typography>
                            <Typography mb={2} sx={{ whiteSpace: 'pre-line' }}>
                                {initialData.Patient.medications_details}
                            </Typography>
                        </>
                    )}
                </Box>

                {/* Additional Info Section */}
                <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        Additional Information
                    </Typography>
                    <Divider />

                    <Typography variant="body2" color="textSecondary" mt={2}>
                        Referral Doctor
                    </Typography>
                    <Typography mb={2}>{initialData?.Patient?.referral_doctor || '-'}</Typography>

                    <Typography variant="body2" color="textSecondary">
                        Old Study for Comparison?
                    </Typography>
                    <Typography mb={2}>{boolToYesNo(initialData?.Patient?.has_old_study)}</Typography>

                    <Typography variant="body2" color="textSecondary">
                        Complaint and Past History
                    </Typography>
                    <Typography mb={2} sx={{ whiteSpace: 'pre-line' }}>
                        {initialData?.Patient?.complaint_history || '-'}
                    </Typography>
                </Box>

                {/* Payment Info Section */}
                <Box>
                    <Typography variant="subtitle1" gutterBottom>
                        Payment Information
                    </Typography>
                    <Divider />

                    <Typography variant="body2" color="textSecondary" mt={2}>
                        Price
                    </Typography>
                    <Typography mb={2}>{initialData.price || '-'}</Typography>

                    <Typography variant="body2" color="textSecondary">
                        Payment Type
                    </Typography>
                    <Typography mb={2}>{initialData.payment_type || '-'}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

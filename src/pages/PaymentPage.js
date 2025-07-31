import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useClinicRequest } from '../contexts/ClinicRequestContext';

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { processPayment, sendOnlinePayment, sendPushNotificationToOrg } = useClinicRequest();

    const { id } = useParams();

    // Assume you passed requestId via location.state when navigating here
    const [price, setPrice] = useState(location.state?.price || '');
    const [paymentType, setPaymentType] = useState(location.state?.paymentType || 'cash');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!id) throw new Error('No request ID provided');

            // 1. Enregistrer le paiement avec type et price
            await processPayment(id, {
                payment_type: paymentType,
                price: Number(price),
            });

            // Send push notification (assume receiver org id is available in location.state)
            if (location.state?.receiverClinicId) {
                await sendPushNotificationToOrg(location.state.receiverClinicId, 'A payment has been processed for your organization.', id);
            }

            if (paymentType === 'online') {
                // 2. Ensuite, récupérer l'URL de facture MyFatoorah
                const { invoiceUrl } = await sendOnlinePayment(id);

                // 3. Redirection vers MyFatoorah
                window.location.href = invoiceUrl;
                return;
            }

            // Cas cash/credit uniquement
            setSuccess(true);
            setTimeout(() => {
                navigate('/newlay/');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
                <Card>
                    <CardHeader title="Price & Payment" />
                    <CardContent>
                        <TextField
                            label="Price"
                            fullWidth
                            sx={{ mb: 3 }}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                            inputProps={{ min: 0, step: 0.01 }}
                            disabled={loading}
                            required
                        />

                        <FormControl component="fieldset" sx={{ mb: 3 }}>
                            <FormLabel component="legend">Payment Type</FormLabel>
                            <RadioGroup
                                row
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value)}
                                name="payment-type-radio"
                            >
                                <FormControlLabel value="cash" control={<Radio />} label="Cash" disabled={loading} />
                                <FormControlLabel value="online" control={<Radio />} label="Online" disabled={loading} />
                                <FormControlLabel value="credit" control={<Radio />} label="Credit" disabled={loading} />
                            </RadioGroup>
                        </FormControl>

                        {error && (
                            <Box color="error.main" mb={2}>
                                {error}
                            </Box>
                        )}

                        <Box textAlign="right">
                            <Button variant="contained" color="primary" type="submit" sx={{ px: 5 }} disabled={loading}>
                                {loading ? 'Processing...' : 'Submit Payment'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Snackbar
                open={success}
                autoHideDuration={2000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Payment processed successfully!
                </Alert>
            </Snackbar>
        </>
    );
}

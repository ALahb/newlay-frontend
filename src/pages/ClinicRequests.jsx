import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    Paper,
    Typography,
    Tooltip,
} from '@mui/material';
import { Visibility, Delete, AttachMoneyOutlined, HourglassEmpty, Cancel, MedicalServices } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useClinicRequest } from '../contexts/ClinicRequestContext'; // Assure-toi du bon chemin

export default function ClinicRequests() {
    const [requests, setRequests] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    const { getAllRequests, deleteRequest } = useClinicRequest();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllRequests();
                setRequests(data);
            } catch (err) {
                console.error('Erreur lors de la récupération des requêtes', err);
            }
        };

        fetchData();
    }, [getAllRequests]);

    const handleDelete = async () => {
        try {
            await deleteRequest(deleteId);
            setRequests((prev) => prev.filter((req) => req.id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            // Tu peux afficher une notification d'erreur ici
        }
    };

    const renderStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return (
                    <Tooltip title="Pending">
                        <HourglassEmpty color="warning" />
                    </Tooltip>
                );
            case 'rejected':
                return (
                    <Tooltip title="Rejected">
                        <Cancel color="error" />
                    </Tooltip>
                );
            case 'waiting_for_payment':
                return (
                    <Tooltip title="Waiting for Payment">
                        <AttachMoneyOutlined color="secondary" />
                    </Tooltip>
                );
            case 'ready_for_examination':
                return (
                    <Tooltip title="Ready for Examination">
                        <MedicalServices color="success" />
                    </Tooltip>
                );
            default:
                return <Typography>{status}</Typography>; // fallback: display text
        }
    };

    return (
        <>
            <Card>
                <CardHeader
                    title="Requests List"
                    action={
                        <Button variant="contained" color="primary" onClick={() => navigate('/clinicrequests/add')}>
                            Add Request
                        </Button>
                    }
                />
                <CardContent>
                    {requests.length === 0 ? (
                        <Typography color="error">Empty list</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Patient Name</TableCell>
                                        <TableCell>Nationality ID</TableCell>
                                        <TableCell>Receiver Clinic</TableCell>
                                        <TableCell>Provider Clinic</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.Patient?.full_name}</TableCell>
                                            <TableCell>{item.Patient?.nationality_id}</TableCell>
                                            <TableCell>{item?.receiverClinic?.name}</TableCell>
                                            <TableCell>{item?.providerClinic?.name}</TableCell>
                                            <TableCell>{renderStatusIcon(item.status)}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="info"
                                                    onClick={() => navigate(`/clinicrequests/edit/${item.id}`)}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                                {item.status === 'waiting_for_payment' && (
                                                    <Tooltip title="Proceed to Payment">
                                                        <IconButton
                                                            color="success"
                                                            onClick={() => navigate(`/clinicrequests/payment/${item.id}`)}
                                                        >
                                                            <AttachMoneyOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <IconButton color="error" onClick={() => setDeleteId(item.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
                <DialogTitle>Are you sure you want to delete this request?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

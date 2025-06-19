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
    TextField,
    MenuItem,
    Box,
} from '@mui/material';
import { Visibility, Delete, AttachMoneyOutlined, HourglassEmpty, Cancel, MedicalServices, CheckCircle, PictureAsPdf } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useClinicRequest } from '../contexts/ClinicRequestContext'; // Assure-toi du bon chemin
import debounce from 'lodash.debounce';
import DashboardStats from '../components/DashboardStats';

export default function ClinicRequests() {
    const [requests, setRequests] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        nationalityId: '',
        providerClinic: '',
        receiverClinic: '',
        status: '',
    });
    const [stats, setStats] = useState({
        total_requests: 0,
        in_progress_requests: 0,
        finished_requests: 0,
        total_clinic_receivers: 0,
        total_clinic_providers: 0,
    });
    const navigate = useNavigate();
    const { getAllRequests, deleteRequest, getStats } = useClinicRequest();

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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (error) {
                console.error("Erreur chargement statistiques :", error);
            }
        };

        fetchStats();
    }, [getStats]);

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

    const handleDownloadPDF = async (url) => {
        try {
            const fullUrl = `http://localhost:5000${url}`;

            const link = document.createElement("a");
            link.href = fullUrl;
            link.download = ""; // le nom du fichier sera pris depuis le serveur
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erreur lors du téléchargement du PDF :", error);
            // Optionnel : afficher une notification d'erreur à l'utilisateur
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
            case 'finished':
                return (
                    <Tooltip title="Finished">
                        <CheckCircle color="primary" />
                    </Tooltip>
                );
            default:
                return <Typography>{status}</Typography>; // fallback: display text
        }
    };

    useEffect(() => {
        const debouncedFilter = debounce(async () => {
            try {
                const trimmedFilters = {
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    nationalityId: filters.nationalityId.trim(),
                    patientName: filters.patientName?.trim(),
                    clinic_receiver_name: filters.receiverClinic.trim(),
                    clinic_provider_name: filters.providerClinic.trim(),
                    status: filters.status,
                };

                const data = await getAllRequests(trimmedFilters);
                setRequests(data);
            } catch (err) {
                console.error("Erreur lors de la récupération filtrée :", err);
            }
        }, 500);

        debouncedFilter();

        return () => debouncedFilter.cancel();
    }, [filters, getAllRequests]);

    const statuses = [
        { value: '', label: 'Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'waiting_for_payment', label: 'Waiting for Payment' },
        { value: 'ready_for_examination', label: 'Ready for Examination' },
        { value: 'waiting_for_result', label: 'Waiting for Result' },
        { value: 'finished', label: 'Finished' },
    ];


    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>

                <DashboardStats
                    totalRequests={stats.total_requests}
                    totalRequestsProgress={stats.in_progress_requests}
                    totalResults={stats.finished_requests}
                    nbClients={stats.total_clinic_receivers}
                    nbProviders={stats.total_clinic_providers}
                />
                <Box sx={{
                    display: 'flex',
                    // flexWrap: 'wrap',
                    gap: 2,
                    // mb: 2,
                    justifyContent: 'space-between',
                }}>
                    <TextField
                        label="Start Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    />
                    <TextField
                        label="Nationality ID"
                        value={filters.nationalityId}
                        onChange={(e) => setFilters({ ...filters, nationalityId: e.target.value })}
                    />
                    <TextField
                        label="Receiver Clinic"
                        value={filters.receiverClinic}
                        onChange={(e) => setFilters({ ...filters, receiverClinic: e.target.value })}
                    />
                    <TextField
                        label="Provider Clinic"
                        value={filters.providerClinic}
                        onChange={(e) => setFilters({ ...filters, providerClinic: e.target.value })}
                    />
                    <TextField
                        id="status-select"
                        select
                        label="Status"
                        value={filters.status || ''}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        sx={{ minWidth: 200 }}
                    >
                        {statuses.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>


                </Box>

            </Box>
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
                                                {item.status === 'finished' && (
                                                    <Tooltip title="Download PDF">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleDownloadPDF(item.report_file)}
                                                        >
                                                            <PictureAsPdf />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
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

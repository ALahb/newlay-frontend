import React from 'react';
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
} from '@mui/material';

import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ClinicRequests({ requests, setRequests }) {
    const [deleteId, setDeleteId] = React.useState(null);
    const navigate = useNavigate();

    const handleDelete = () => {
        setRequests(requests.filter((req) => req.id !== deleteId));
        setDeleteId(null);
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
                                        <TableCell>Client</TableCell>
                                        <TableCell>Provider</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.patientName}</TableCell>
                                            <TableCell>{item.nationalityId}</TableCell>
                                            <TableCell>{item.client}</TableCell>
                                            <TableCell>{item.provider}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            <TableCell>
                                                <IconButton color="info" onClick={() => navigate(`/clinicrequests/edit/${item.id}`)}
                                                >
                                                    <Edit />
                                                </IconButton>
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

            {/* Delete Confirmation Dialog */}
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

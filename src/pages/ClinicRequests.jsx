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
  Pagination,
  Grid,
  DialogContent,
} from '@mui/material';
import { Visibility, Delete, AttachMoneyOutlined, HourglassEmpty, Cancel, MedicalServices, CheckCircle, PictureAsPdf, CloudUpload } from '@mui/icons-material';
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
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 5,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const navigate = useNavigate();
  const { getAllRequests, deleteRequest, getStats, patchRequestStatus, uploadReport, createCaseDetails, sendPushNotificationToOrg } = useClinicRequest();
  const [uploadModal, setUploadModal] = useState({ open: false, request: null });
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllRequests({ clinic_provider_id: localStorage.getItem('orgId'), clinic_receiver_id: localStorage.getItem('orgId') }, page, 10);
        setRequests(response.data);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Erreur lors de la récupération des requêtes', err);
      }
    };

    fetchData();
  }, [getAllRequests, page, filters]);

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
      // Send push notification to receiver
      const deletedRequest = requests.find(r => r.id === deleteId);
      if (deletedRequest && deletedRequest.receiverClinic?.id) {
        await sendPushNotificationToOrg(deletedRequest.receiverClinic.id, 'A request has been deleted for your organization.');
      }
      // Reload current page data
      const response = await getAllRequests({}, page, 10);
      setRequests(response.data);
      setPagination(response.pagination);
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

        const response = await getAllRequests(trimmedFilters, 1, 10);
        setRequests(response.data);
        setPagination(response.pagination);
        setPage(1); // Reset to first page when filters change
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleApprove = async (id) => {
    try {
      await patchRequestStatus(id, 'waiting_for_payment');
      // Refresh list
      const response = await getAllRequests({ clinic_provider_id: localStorage.getItem('orgId'), clinic_receiver_id: localStorage.getItem('orgId') }, page, 10);
      setRequests(response.data);
      setPagination(response.pagination);
    } catch (error) {
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleDecline = async (id) => {
    try {
      await patchRequestStatus(id, 'rejected');
      // Refresh list
      const response = await getAllRequests({ clinic_provider_id: localStorage.getItem('orgId'), clinic_receiver_id: localStorage.getItem('orgId') }, page, 10);
      setRequests(response.data);
      setPagination(response.pagination);
    } catch (error) {
      alert('Erreur lors du refus');
    }
  };

  // API calls for upload
  const handleUpload = async () => {
    if (!uploadUrl || !uploadModal.request) return;
    setUploadLoading(true);
    try {
      // 1. Créer le case AWS
      await createCaseDetails({
        src_org_id: uploadModal.request.providerClinic?.id,
        dest_org_id: uploadModal.request.receiverClinic?.id,
        patient_id: uploadModal.request.Patient?.id,
        radgate_id: uploadModal.request.providerClinic?.id // change if needed
      });

      // 2. Mettre à jour le statut à 'waiting_for_result'
      await patchRequestStatus(uploadModal.request.id, 'waiting_for_result');

      // 3. Uploader le report (ce qui mettra finished côté backend)
      await uploadReport(uploadModal.request.id, uploadUrl);

      setUploadModal({ open: false, request: null });
      setUploadUrl('');
      // Refresh list
      const response = await getAllRequests({ clinic_provider_id: localStorage.getItem('orgId'), clinic_receiver_id: localStorage.getItem('orgId') }, page, 10);
      setRequests(response.data);
      setPagination(response.pagination);
    } catch (error) {
      alert('Erreur lors de l\'upload');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3, width: '100%' }}>
        <DashboardStats
          totalRequests={stats.total_requests}
          totalRequestsProgress={stats.in_progress_requests}
          totalResults={stats.finished_requests}
          nbClients={stats.total_clinic_receivers}
          nbProviders={stats.total_clinic_providers}
        />

        {/* Filters */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            mb: 2,
          }}
        >
          {[
            { label: 'Start Date', type: 'date', value: filters.startDate, key: 'startDate' },
            { label: 'End Date', type: 'date', value: filters.endDate, key: 'endDate' },
            { label: 'Nationality ID', value: filters.nationalityId, key: 'nationalityId' },
            { label: 'Receiver Clinic', value: filters.receiverClinic, key: 'receiverClinic' },
            { label: 'Provider Clinic', value: filters.providerClinic, key: 'providerClinic' }
          ].map(({ label, type, value, key }) => (
            <TextField
              key={key}
              label={label}
              type={type || 'text'}
              InputLabelProps={type === 'date' ? { shrink: true } : undefined}
              value={value}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              fullWidth
              sx={{ flex: { md: '1 1 200px', lg: '1 1 250px' } }}
            />
          ))}

          {/* Status Select */}
          <TextField
            select
            label="Status"
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            fullWidth
            sx={{ flex: { md: '1 1 200px', lg: '1 1 250px' } }}
          >
            {statuses.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>


      </Box>

      {/* Table Card */}
      <Card>
        <CardHeader
          title="Requests List"
          action={
            <Button variant="contained" color="primary" onClick={() => navigate('/newlay/clinicrequests/add')}>
              Add Request
            </Button>
          }
        />
        <CardContent>
          {requests.length === 0 ? (
            <Typography color="error">Empty list</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Nationality ID</TableCell>
                    <TableCell>Receiver Clinic</TableCell>
                    <TableCell>Provider Clinic</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.slice().reverse().map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.Patient?.full_name}</TableCell>
                      <TableCell>{item.Patient?.nationality_id}</TableCell>
                      <TableCell>{item?.receiverClinic?.name}</TableCell>
                      <TableCell>{item?.providerClinic?.name}</TableCell>
                      <TableCell>{renderStatusIcon(item.status)}</TableCell>
                      <TableCell>
                        {String(item?.receiverClinic?.id) === String(localStorage.getItem('orgId')) ? (
                          <>
                            <IconButton color="info" onClick={() => navigate(`/newlay/clinicrequests/edit/${item.id}`)}>
                              <Visibility />
                            </IconButton>
                            {item.status === 'pending' && (
                              <>
                                <Tooltip title="Approve">
                                  <span>
                                    <IconButton
                                      color="success"
                                      onClick={() => handleApprove(item.id)}
                                      disabled={item.status !== 'pending'}
                                    >
                                      <CheckCircle />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Decline">
                                  <span>
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDecline(item.id)}
                                      disabled={item.status !== 'pending'}
                                    >
                                      <Cancel />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <IconButton color="info" onClick={() => navigate(`/newlay/clinicrequests/edit/${item.id}`)}>
                              <Visibility />
                            </IconButton>
                            {item.status === 'waiting_for_payment' && (
                              <Tooltip title="Proceed to Payment">
                                <IconButton color="success" onClick={() => navigate(`/newlay/clinicrequests/payment/${item.id}`)}>
                                  <AttachMoneyOutlined />
                                </IconButton>
                              </Tooltip>
                            )}
                            <IconButton color="error" onClick={() => setDeleteId(item.id)}>
                              <Delete />
                            </IconButton>
                            {item.status === 'finished' && (
                              <Tooltip title="Download PDF">
                                <IconButton color="primary" onClick={() => handleDownloadPDF(item.report_file)}>
                                  <PictureAsPdf />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
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

      {/* Pagination Controls */}
      {requests.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            p: 2,
            gap: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} results
          </Typography>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Delete Dialog */}
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

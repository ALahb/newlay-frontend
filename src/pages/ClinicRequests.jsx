import React, { useEffect, useState } from "react";
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
  DialogContent,
  useTheme,
  Chip,
} from "@mui/material";
import {
  Visibility,
  Delete,
  AttachMoneyOutlined,
  HourglassEmpty,
  Cancel,
  MedicalServices,
  CheckCircle,
  PictureAsPdf,
  Add,
  WorkHistory,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useClinicRequest } from "../contexts/ClinicRequestContext";
import { useUser } from "../contexts/UserContext";
import DashboardStats from "../components/DashboardStats";
import { getUserType, getUserDisplayName } from "../utils/userTheme";
import { getClinicRequest } from "../api";

export default function ClinicRequests() {
  const theme = useTheme();
  const { user } = useUser();
  const userType = getUserType(user);
  const userDisplayName = getUserDisplayName(user);

  const [requests, setRequests] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    nationalityId: "",
    providerClinic: "",
    receiverClinic: "",
    status: "",
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
  const {
    getAllRequests,
    deleteRequest,
    getStats,
    patchRequestStatus,
    uploadReport,
    createCaseDetails,
    getReportUrlFromApi,
  } = useClinicRequest();
  const [uploadModal, setUploadModal] = useState({
    open: false,
    request: null,
  });
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [accessionNumberModal, setAccessionNumberModal] = useState({
    open: false,
    request: null,
  });
  const [accessionNumber, setAccessionNumber] = useState("");
  const [patientId, setPatientId] = useState("");
  const [accessionNumberLoading, setAccessionNumberLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      const filtersWithIds = {
        ...filters,
        clinic_provider_id: localStorage.getItem("orgId"),
        clinic_receiver_id:
          filters.receiverClinic || localStorage.getItem("orgId"),
      };
      getAllRequests(filtersWithIds, page, 10).then((response) => {
        setRequests(response.data);
        setPagination(response.pagination);
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [filters, page, getAllRequests]);

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
      // Push notification is now handled automatically in the API
      await deleteRequest(deleteId);
      const response = await getAllRequests(
        {
          clinic_provider_id: localStorage.getItem("orgId"),
          clinic_receiver_id: localStorage.getItem("orgId"),
        },
        page,
        10
      );
      setRequests(response.data);
      setPagination(response.pagination);
      setDeleteId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleDownloadPDF = async (url, requestId) => {
    try {
      const request = await getClinicRequest(requestId);
      const reportUrlData = await getReportUrlFromApi(
        requestId,
        request?.receiverClinic?.id
      );

      let pdfUrl = null;

      if (
        reportUrlData.status === "success" &&
        reportUrlData.message?.data?.report_pdf
      ) {
        pdfUrl = reportUrlData.message.data.report_pdf;
      } else if (reportUrlData.url || reportUrlData.report_url) {
        pdfUrl = reportUrlData.url || reportUrlData.report_url;
      } else {
        pdfUrl = url;
      }

      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
      } else {
        console.error("No PDF URL found in response");
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF :", error);
    }
  };

  const renderStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <Tooltip title="Pending">
            <HourglassEmpty color="warning" />
          </Tooltip>
        );
      case "rejected":
        return (
          <Tooltip title="Rejected">
            <Cancel color="error" />
          </Tooltip>
        );
      case "waiting_for_payment":
        return (
          <Tooltip title="Waiting for Payment">
            <AttachMoneyOutlined color="secondary" />
          </Tooltip>
        );
      case "ready_for_examination":
        return (
          <Tooltip title="Ready for Examination">
            <MedicalServices color="success" />
          </Tooltip>
        );
      case "waiting_for_result":
        return (
          <Tooltip title="Waiting for Result">
            <WorkHistory color="warning" />
          </Tooltip>
        );
      case "finished":
        return (
          <Tooltip title="Finished">
            <CheckCircle color="primary" />
          </Tooltip>
        );
      default:
        return <Typography>{status}</Typography>;
    }
  };

  const statuses = [
    { value: "", label: "Status" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "waiting_for_payment", label: "Waiting for Payment" },
    { value: "ready_for_examination", label: "Ready for Examination" },
    { value: "waiting_for_result", label: "Waiting for Result" },
    { value: "finished", label: "Finished" },
  ];

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleApprove = async (id) => {
    try {
      await patchRequestStatus(id, "waiting_for_payment");
      const response = await getAllRequests(
        {
          clinic_provider_id: localStorage.getItem("orgId"),
          clinic_receiver_id: localStorage.getItem("orgId"),
        },
        page,
        10
      );
      setRequests(response.data);
      setPagination(response.pagination);
    } catch (error) {
      alert("Erreur lors de l'approbation");
    }
  };

  const handleDecline = async (id) => {
    try {
      await patchRequestStatus(id, "rejected");
      const response = await getAllRequests(
        {
          clinic_provider_id: localStorage.getItem("orgId"),
          clinic_receiver_id: localStorage.getItem("orgId"),
        },
        page,
        10
      );
      setRequests(response.data);
      setPagination(response.pagination);
    } catch (error) {
      alert("Erreur lors du refus");
    }
  };

  const handleAccessionNumber = async () => {
    setAccessionNumberLoading(true);
    try {
      await createCaseDetails({
        accession_number: accessionNumber,
        src_org_id: accessionNumberModal.request.providerClinic?.id,
        dest_org_id: accessionNumberModal.request.receiverClinic?.id,
        patient_id: patientId || accessionNumberModal.request.Patient?.id,
        radgate_id: accessionNumberModal.request?.id,
      });

      const updatedRequests = requests.map((req) =>
        req.id === accessionNumberModal.request.id
          ? { ...req, accession_number_added: true }
          : req
      );
      setRequests(updatedRequests);
    } catch (error) {
      console.log(error);
      alert("Erreur lors de l'ajout du numéro d'accès");
    } finally {
      setAccessionNumberLoading(false);
      setAccessionNumberModal({ open: false, request: null });
      setAccessionNumber("");
      setPatientId("");
    }
  };

  const handleUpload = async () => {
    if (!uploadUrl || !uploadModal.request) return;
    setUploadLoading(true);
    try {
      await createCaseDetails({
        src_org_id: uploadModal.request.providerClinic?.id,
        dest_org_id: uploadModal.request.receiverClinic?.id,
        patient_id: uploadModal.request.Patient?.id,
        radgate_id: uploadModal.request?.id,
      });

      await patchRequestStatus(uploadModal.request.id, "waiting_for_result");

      await uploadReport(uploadModal.request.id, uploadUrl);

      setUploadModal({ open: false, request: null });
      setUploadUrl("");
      const response = await getAllRequests(
        {
          clinic_provider_id: localStorage.getItem("orgId"),
          clinic_receiver_id: localStorage.getItem("orgId"),
        },
        page,
        10
      );
      setRequests(response.data);
      setPagination(response.pagination);
    } catch (error) {
      alert("Erreur lors de l'upload");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <>
      {/* User Type Indicator */}
      {userType && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.light}20)`,
            border: `1px solid ${theme.palette.primary.main}30`,
          }}
        >
          <Box>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Welcome, {userDisplayName}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You're currently in {userType.toLowerCase()} mode
            </Typography>
          </Box>
          <Chip
            label={userType}
            color="primary"
            variant="filled"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              color: "white",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mb: 3,
          width: "100%",
        }}
      >
        <DashboardStats
          totalRequests={stats.total_requests}
          totalRequestsProgress={stats.in_progress_requests}
          totalResults={stats.finished_requests}
          nbClients={stats.total_clinic_receivers}
          nbProviders={stats.total_clinic_providers}
        />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          {[
            {
              label: "Start Date",
              type: "date",
              value: filters.startDate,
              key: "startDate",
            },
            {
              label: "End Date",
              type: "date",
              value: filters.endDate,
              key: "endDate",
            },
            {
              label: "Nationality ID",
              value: filters.nationalityId,
              key: "nationalityId",
            },
            {
              label: "Receiver Clinic",
              value: filters.receiverClinic,
              key: "receiverClinic",
            },
            {
              label: "Provider Clinic",
              value: filters.providerClinic,
              key: "providerClinic",
            },
          ].map(({ label, type, value, key }) => (
            <TextField
              key={key}
              label={label}
              type={type || "text"}
              InputLabelProps={type === "date" ? { shrink: true } : undefined}
              value={value}
              onChange={(e) =>
                setFilters({ ...filters, [key]: e.target.value })
              }
              fullWidth
              sx={{ flex: { md: "1 1 200px", lg: "1 1 250px" } }}
            />
          ))}

          <TextField
            select
            label="Status"
            value={filters.status || ""}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            fullWidth
            sx={{ flex: { md: "1 1 200px", lg: "1 1 250px" } }}
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/newlay/clinicrequests/add")}
            >
              Add Request
            </Button>
          }
        />
        <CardContent>
          {requests.length === 0 ? (
            <Typography color="error">Empty list</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
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
                  {requests
                    .slice()
                    .reverse()
                    .map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.Patient?.full_name}</TableCell>
                        <TableCell>{item.Patient?.nationality_id}</TableCell>
                        <TableCell>{item?.receiverClinic?.name}</TableCell>
                        <TableCell>{item?.providerClinic?.name}</TableCell>
                        <TableCell>{renderStatusIcon(item.status)}</TableCell>
                        <TableCell>
                          {String(item?.receiverClinic?.id) ===
                          String(localStorage.getItem("orgId")) ? (
                            <>
                              <IconButton
                                color="info"
                                onClick={() =>
                                  navigate(
                                    `/newlay/clinicrequests/edit/${item.id}`
                                  )
                                }
                              >
                                <Visibility />
                              </IconButton>
                              {item.status === "pending" && (
                                <>
                                  <Tooltip title="Approve">
                                    <span>
                                      <IconButton
                                        color="success"
                                        onClick={() => handleApprove(item.id)}
                                        disabled={item.status !== "pending"}
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
                                        disabled={item.status !== "pending"}
                                      >
                                        <Cancel />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </>
                              )}
                              {item.status === "ready_for_examination" &&
                                !item.accession_number_added && (
                                  <Tooltip title="Add Accession Number">
                                    <span>
                                      <IconButton
                                        color="primary"
                                        onClick={() => {
                                          setAccessionNumberModal({
                                            open: true,
                                            request: item,
                                          });
                                          setPatientId(
                                            item.Patient?.patient_code || ""
                                          );
                                          setAccessionNumber(
                                            item?.accession_number || ""
                                          );
                                        }}
                                      >
                                        <Add />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                )}
                              {item.status === "finished" && (
                                <Tooltip title="View PDF Report">
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      handleDownloadPDF(
                                        item.report_file,
                                        item.id
                                      )
                                    }
                                  >
                                    <PictureAsPdf />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </>
                          ) : (
                            <>
                              <IconButton
                                color="info"
                                onClick={() =>
                                  navigate(
                                    `/newlay/clinicrequests/edit/${item.id}`
                                  )
                                }
                              >
                                <Visibility />
                              </IconButton>
                              {item.status === "waiting_for_payment" && (
                                <Tooltip title="Proceed to Payment">
                                  <IconButton
                                    color="success"
                                    onClick={() =>
                                      navigate(
                                        `/newlay/clinicrequests/payment/${item.id}`
                                      )
                                    }
                                  >
                                    <AttachMoneyOutlined />
                                  </IconButton>
                                </Tooltip>
                              )}

                              <IconButton
                                color="error"
                                onClick={() => setDeleteId(item.id)}
                              >
                                <Delete />
                              </IconButton>
                              {item.status === "finished" && (
                                <Tooltip title="View PDF Report">
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      handleDownloadPDF(
                                        item.report_file,
                                        item.id
                                      )
                                    }
                                  >
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

      {requests.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            p: 2,
            gap: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalCount
            )}{" "}
            of {pagination.totalCount} results
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

      <Dialog
        open={accessionNumberModal.open}
        onClose={() => setAccessionNumberModal({ open: false, request: null })}
      >
        <DialogTitle>Add Accession Number</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Accession Number"
            type="text"
            fullWidth
            value={accessionNumber}
            onChange={(e) => setAccessionNumber(e.target.value)}
            disabled={accessionNumberLoading}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Patient ID"
            type="text"
            fullWidth
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={accessionNumberLoading}
            placeholder={
              accessionNumberModal.request?.Patient?.id || "Enter Patient ID"
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAccessionNumberModal({ open: false, request: null });
              setAccessionNumber("");
              setPatientId("");
            }}
            color="primary"
            disabled={accessionNumberLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAccessionNumber}
            color="primary"
            disabled={!accessionNumber || accessionNumberLoading}
          >
            {accessionNumberLoading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

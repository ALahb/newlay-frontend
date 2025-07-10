import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import { blue, orange, green, red } from '@mui/material/colors';
import { TransferWithinAStation, Autorenew, CheckCircle, HomeWork } from '@mui/icons-material';

export default function DashboardStats({ totalRequests, totalRequestsProgress, totalResults, nbClients, nbProviders }) {
  return (
    <Box width={'100%'}>
      <Grid container spacing={12}>
        <Grid item xs={12} lg={3}>
          <Card sx={{ borderRadius: 2, bgcolor: blue[700], color: 'white' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" fontWeight="bold">{totalRequests}</Typography>
                <Typography>Total Requests</Typography>
              </Box>
              <TransferWithinAStation sx={{ fontSize: 35 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Card sx={{ borderRadius: 2, bgcolor: orange[600], color: 'white' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" fontWeight="bold">{totalRequestsProgress}</Typography>
                <Typography>Requests In Progress</Typography>
              </Box>
              <Autorenew sx={{ fontSize: 35 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Card sx={{ borderRadius: 2, bgcolor: green[600], color: 'white' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" fontWeight="bold">{totalResults}</Typography>
                <Typography>Results</Typography>
              </Box>
              <CheckCircle sx={{ fontSize: 35 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Card sx={{ borderRadius: 2, bgcolor: red[600], color: 'white' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h4" fontWeight="bold">{nbClients + nbProviders}</Typography>
                <Typography>Total Clinics</Typography>
              </Box>
              <Box pr={3} borderRight="2px solid white" mr={2}>
                <Typography variant="h4" fontWeight="bold">{nbClients}</Typography>
                <Typography>Clients</Typography>
              </Box>
              <Box pl={2} pr={1}>
                <Typography variant="h4" fontWeight="bold">{nbProviders}</Typography>
                <Typography>Providers</Typography>
              </Box>
              <HomeWork sx={{ fontSize: 35, ml: 'auto' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>

  );
}

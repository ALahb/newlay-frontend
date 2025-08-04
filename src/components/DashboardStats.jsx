import { Card, CardContent, Grid, Typography, Box, useTheme } from '@mui/material';
import { TransferWithinAStation, Autorenew, CheckCircle, HomeWork } from '@mui/icons-material';

export default function DashboardStats({ totalRequests, totalRequestsProgress, totalResults, nbClients, nbProviders }) {
  const theme = useTheme();
  
  return (
    <Box width="100%" fontStyle={{display:'flex', justifyContent:'center'}}>
      <Grid container spacing={2}>
        {/* Total Requests */}
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Card sx={{ 
            borderRadius: 2, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            color: 'white',
            boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
          }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, sm: 2.5 } }}>
              <Box>
                <Typography variant="h5" fontWeight="bold" fontSize={{ xs: '1.5rem', sm: '2rem' }}>{totalRequests}</Typography>
                <Typography fontSize={{ xs: '0.85rem', sm: '1rem' }}>Total Requests</Typography>
              </Box>
              <TransferWithinAStation sx={{ fontSize: { xs: 28, sm: 35 } }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Requests In Progress */}
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Card sx={{ 
            borderRadius: 2, 
            background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.light || theme.palette.warning.main})`,
            color: 'white',
            boxShadow: `0 4px 12px ${theme.palette.warning.main}40`
          }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, sm: 2.5 } }}>
              <Box>
                <Typography variant="h5" fontWeight="bold" fontSize={{ xs: '1.5rem', sm: '2rem' }}>{totalRequestsProgress}</Typography>
                <Typography fontSize={{ xs: '0.85rem', sm: '1rem' }}>Requests In Progress</Typography>
              </Box>
              <Autorenew sx={{ fontSize: { xs: 28, sm: 35 } }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Card sx={{ 
            borderRadius: 2, 
            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light || theme.palette.success.main})`,
            color: 'white',
            boxShadow: `0 4px 12px ${theme.palette.success.main}40`
          }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, sm: 2.5 } }}>
              <Box>
                <Typography variant="h5" fontWeight="bold" fontSize={{ xs: '1.5rem', sm: '2rem' }}>{totalResults}</Typography>
                <Typography fontSize={{ xs: '0.85rem', sm: '1rem' }}>Results</Typography>
              </Box>
              <CheckCircle sx={{ fontSize: { xs: 28, sm: 35 } }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Total Clinics */}
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Card sx={{ 
            borderRadius: 2, 
            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
            color: 'white',
            boxShadow: `0 4px 12px ${theme.palette.secondary.main}40`
          }}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                p: { xs: 2, sm: 2.5 },
              }}
            >
              {/* Total Clinics */}
              <Box sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  fontSize={{ xs: '1.5rem', sm: '2rem' }}
                >
                  {nbClients + nbProviders}
                </Typography>
                <Typography fontSize={{ xs: '0.85rem', sm: '1rem' }}>Total Clinics</Typography>
              </Box>

              {/* Clients + Providers */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography fontWeight="bold" fontSize={{ xs: '1rem', sm: '1.25rem' }}>
                    {nbClients}
                  </Typography>
                  <Typography fontSize={{ xs: '0.8rem', sm: '0.95rem' }}>Clients</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography fontWeight="bold" fontSize={{ xs: '1rem', sm: '1.25rem' }}>
                    {nbProviders}
                  </Typography>
                  <Typography fontSize={{ xs: '0.8rem', sm: '0.95rem' }}>Providers</Typography>
                </Box>
              </Box>

              {/* Icon */}
              <Box sx={{ textAlign: 'center' }}>
                <HomeWork sx={{ fontSize: { xs: 28, sm: 35 } }} />
      </Box>
    </CardContent>
  </Card>
</Grid>

      </Grid>
    </Box>
  );
}

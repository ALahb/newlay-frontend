import { createTheme } from '@mui/material/styles';

// Doctor theme
export const doctorTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Medical blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e', // Medical red
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f8fbff', // Light blue tint
      paper: '#ffffff',
    },
    text: {
      primary: '#1a237e', // Dark blue
      secondary: '#424242',
    },
    success: {
      main: '#2e7d32', // Medical green
    },
    warning: {
      main: '#ed6c02', // Medical orange
    },
    error: {
      main: '#d32f2f', // Medical red
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #e3f2fd',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        },
      },
    },
  },
});

// Technician theme
export const technicianTheme = createTheme({
  palette: {
    primary: {
      main: '#ff9800', // Technical orange
      light: '#ffb74d',
      dark: '#f57c00',
    },
    secondary: {
      main: '#607d8b', // Technical blue-gray
      light: '#90a4ae',
      dark: '#455a64',
    },
    background: {
      default: '#fafafa', // Light gray
      paper: '#ffffff',
    },
    text: {
      primary: '#37474f', // Dark gray
      secondary: '#546e7a',
    },
    success: {
      main: '#4caf50', // Technical green
    },
    warning: {
      main: '#ff9800', // Technical orange
    },
    error: {
      main: '#f44336', // Technical red
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #fff3e0',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(255, 152, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
        },
      },
    },
  },
});

// Default theme
export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
      light: '#7986cb',
      dark: '#303f9f',
    },
    secondary: {
      main: '#f50057', // Pink
      light: '#ff5983',
      dark: '#c51162',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
        },
      },
    },
  },
});

export const getUserTheme = (userType) => {
  switch (userType?.toLowerCase()) {
    case 'doctor':
      return doctorTheme;
    case 'technician':
    case 'tech':
      return technicianTheme;
    default:
      return defaultTheme;
  }
};

export const getUserType = (user) => {
  if (!user) return null;
  
  const userType = user.message?.user?.type || 
                   user.message?.user?.userType || 
                   user.data?.type || 
                   user.type;
  
  return userType;
};

export const getUserDisplayName = (user) => {
  if (!user) return 'User';
  
  const userName = user.message?.user?.name || 
                   user.message?.user?.fullName || 
                   user.data?.name || 
                   user.name;
  
  return userName || 'User';
}; 
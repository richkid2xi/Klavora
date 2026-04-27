import { createTheme, ThemeOptions } from '@mui/material/styles'

const commonSettings: ThemeOptions = {
  typography: {
    fontFamily: [
      '"Inter"',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1.1rem', fontWeight: 600 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 700,
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#0EA5E9',
          '&:hover': {
            backgroundColor: '#0284C7',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#F9FAFB',
            '& fieldset': {
              borderColor: '#E5E7EB',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: '#D1D5DB',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0EA5E9',
              borderWidth: '2px',
            },
          },
          '& .MuiInputBase-input': {
            padding: '12px 16px',
            fontSize: '0.875rem',
            color: '#111827',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
}

export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: '#0EA5E9',
    },
    secondary: {
      main: '#F59E0B',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
  },
})

export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#0EA5E9',
    },
    secondary: {
      main: '#F59E0B',
    },
    background: {
      default: '#0B0D12',
      paper: '#11141B',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#8B949E',
    },
    divider: '#1E232D',
  },
  components: {
    ...commonSettings.components,
    MuiTextField: {
      styleOverrides: {
        ...commonSettings.components?.MuiTextField?.styleOverrides,
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#0B0D12',
            '& fieldset': {
              borderColor: '#1E232D',
            },
            '&:hover fieldset': {
              borderColor: '#2D3543',
            },
          },
          '& .MuiInputBase-input': {
            color: '#F9FAFB',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        ...commonSettings.components?.MuiPaper?.styleOverrides,
        root: {
          backgroundColor: '#11141B',
          backgroundImage: 'none',
          border: '1px solid #1E232D',
        },
      },
    },
  },
})

import { createTheme, ThemeOptions } from '@mui/material/styles'

const commonSettings: ThemeOptions = {
  typography: {
    fontFamily: [
      '"Plus Jakarta Sans"',
      '"Outfit"',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.75rem', fontWeight: 700 },
    h3: { fontSize: '1.5rem', fontWeight: 700 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.1rem', fontWeight: 600 },
    h6: { fontSize: '0.9rem', fontWeight: 600 },
    body1: { fontSize: '0.9rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.8rem', fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: '0.7rem', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.85rem',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.15)',
            },
          },
          '& .MuiInputBase-input': {
            padding: '10px 14px',
            fontSize: '0.85rem',
          },
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
      main: '#00a3ff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
})

export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#00a3ff',
    },
    background: {
      default: '#080c14',
      paper: '#111827',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  components: {
    ...commonSettings.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0a0f18',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
})

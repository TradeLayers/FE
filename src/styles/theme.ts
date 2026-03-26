import { createTheme } from '@mui/material';

const MainTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#00b8d4' },
        secondary: { main: '#1e2a35' },
        background: {
            default: '#0b0e11',
            paper: '#16171d',
        },
        text: {
            primary: '#e0e0e0',
            secondary: '#8a919e',
        },
        divider: 'rgba(255, 255, 255, 0.08)',
        success: { main: '#00c853' },
        error: { main: '#ff1744' },
        warning: { main: '#ff9100' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
        h3: { fontSize: '1.75rem', fontWeight: 600 },
        h4: { fontSize: '1.5rem', fontWeight: 600 },
        h5: { fontSize: '1.25rem', fontWeight: 600 },
        h6: { fontSize: '1rem', fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    boxShadow: 'none',
                },
            },
        },
    },
});

export default MainTheme;

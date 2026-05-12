import { createTheme, type Theme } from '@mui/material';

export type MainThemeMode = 'light' | 'dark';

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
            secondary: '#c0c5cf',
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

export const LightTheme: Theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#008fa3' },
        secondary: { main: '#455a64' },
        background: {
            default: '#f5f7fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#172026',
            secondary: '#52616b',
        },
        divider: 'rgba(23, 32, 38, 0.12)',
        success: { main: '#00a846' },
        error: { main: '#d50032' },
        warning: { main: '#ef7d00' },
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

export const getMainTheme = (mode: MainThemeMode): Theme =>
    mode === 'light' ? LightTheme : MainTheme;

export default MainTheme;

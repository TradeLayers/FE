import { createTheme } from '@mui/material';

const MainTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00c853',
        },
        secondary: {
            main: '#2962ff',
        },
        background: {
            default: '#0b0e11',
            paper: '#1c1f24',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

export default MainTheme;

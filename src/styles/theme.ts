import { createTheme } from '@mui/material';

const MainTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#2962ff' },
        secondary: { main: '#ffffff' },
        background: {
            default: '#0b0e11',
            paper: '#16171dff',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
});

export default MainTheme;

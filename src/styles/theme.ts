import { createTheme } from '@mui/material';

const MainTheme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
        mode: 'light', // or 'dark'
    },
});

export default MainTheme;

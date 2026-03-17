import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

const MainPage: React.FC = () => {
    return (
        <Box 
            sx={{ p: 3 }}>
            <Box 
                sx={{ display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3 }}>
                <Typography 
                    variant="h4" 
                    component="h1">

                    Stock Tracker
                </Typography>
                <Button 
                    variant="outlined" 
                    size="large"
                    sx={{ 
                        px: 4, 
                        py: 1.5, 
                        fontSize: '1.1rem' }}
                    component={RouterLink} 
                    to="/login">

                    Login
                </Button>
            </Box>
            <Outlet />
        </Box>
    );
};

export default MainPage;
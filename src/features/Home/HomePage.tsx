import { Box, Typography } from '@mui/material';

const HomePage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Welcome to TradeLayers
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Track market movements and stay connected to your portfolio
                in one place.
            </Typography>
        </Box>
    );
};

export default HomePage;

import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';

const sections: Array<{ title: string; points: string[] }> = [
    {
        title: '1. Sign In And Account Setup',
        points: [
            'Use the Login button in the top-right corner to sign in with Firebase authentication.',
            'After sign in, your user profile is created or fetched automatically in the backend.',
            'Signed-in users can access Account and Compare pages.',
        ],
    },
    {
        title: '2. Discover Stocks',
        points: [
            'Use the Stocks page to browse available symbols, search, and view quotes/profile/candles.',
            'Prices are updated from market data and shown across watchlist, portfolio, and stock views.',
        ],
    },
    {
        title: '3. Watchlist And Threshold Alerts',
        points: [
            'Add a stock to your watchlist from the Stocks page, then open Account to manage it.',
            'Set a threshold value per watchlist stock and press Save.',
            'Alert rule: you are notified when price falls to or below your threshold.',
            'If the threshold is hit while you are online, notification appears in-app.',
            'If it is hit while you are logged out, unread notification appears after login.',
        ],
    },
    {
        title: '4. Portfolio Trading',
        points: [
            'Buy and sell from Portfolio using valid quantities.',
            'Track holdings, transaction history, and portfolio value timeline.',
            'Validation protects against invalid quantity, insufficient balance, and insufficient holdings.',
        ],
    },
    {
        title: '5. Compare And Learn',
        points: [
            'Use Compare page to inspect multiple stocks side-by-side.',
            'Use Learn page as a quick reference for workflows and feature behavior.',
        ],
    },
    {
        title: '6. Common Questions',
        points: [
            'Why no alert yet? The condition is only triggered when current price is less than or equal to your threshold.',
            'Why one alert per crossing? The system avoids duplicate notifications until price moves back above threshold and crosses again.',
            'Why empty watchlist? Add symbols first from the Stocks page.',
        ],
    },
];

const LearnPage: React.FC = () => {
    return (
        <Box sx={{ maxWidth: 980, mx: 'auto' }}>
            <Stack spacing={2}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Learn Stock Tracker
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        This page explains how to use the app end-to-end, including watchlist
                        thresholds and notifications.
                    </Typography>
                </Box>

                {sections.map((section) => (
                    <Paper key={section.title} variant="outlined" sx={{ p: 2.5 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            {section.title}
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        <List dense>
                            {section.points.map((point) => (
                                <ListItem key={point} disablePadding sx={{ py: 0.25 }}>
                                    <ListItemText primary={point} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
};

export default LearnPage;

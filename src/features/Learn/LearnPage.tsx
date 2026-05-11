import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
    Avatar,
    Box,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { type ElementType } from 'react';

type LearnSection = {
    step: string;
    title: string;
    icon: ElementType;
    points: string[];
};

const sections: LearnSection[] = [
    {
        step: '01',
        title: 'Sign In And Account Setup',
        icon: LoginOutlinedIcon,
        points: [
            'Use the Login button in the top-right corner to sign in with Firebase authentication.',
            'After sign in, your user profile is created or fetched automatically in the backend.',
            'Signed-in users can access Account and Compare pages.',
        ],
    },
    {
        step: '02',
        title: 'Discover Stocks',
        icon: SearchOutlinedIcon,
        points: [
            'Use the Stocks page to browse available symbols, search, and view quotes/profile/candles.',
            'Prices are updated from market data and shown across watchlist, portfolio, and stock views.',
        ],
    },
    {
        step: '03',
        title: 'Watchlist And Threshold Alerts',
        icon: NotificationsActiveOutlinedIcon,
        points: [
            'Add a stock to your watchlist from the Stocks page, then open Account to manage it.',
            'Set a threshold value per watchlist stock and press Save.',
            'Alert rule: you are notified when price falls to or below your threshold.',
            'If the threshold is hit while you are online, notification appears in-app.',
            'If it is hit while you are logged out, unread notification appears after login.',
        ],
    },
    {
        step: '04',
        title: 'Portfolio Trading',
        icon: AccountBalanceWalletOutlinedIcon,
        points: [
            'Buy and sell from Portfolio using valid quantities.',
            'Track holdings, transaction history, and portfolio value timeline.',
            'Validation protects against invalid quantity, insufficient balance, and insufficient holdings.',
        ],
    },
    {
        step: '05',
        title: 'Compare And Learn',
        icon: CompareArrowsOutlinedIcon,
        points: [
            'Use Compare page to inspect multiple stocks side-by-side.',
            'Use Learn page as a quick reference for workflows and feature behavior.',
        ],
    },
    {
        step: '06',
        title: 'Common Questions',
        icon: HelpOutlineOutlinedIcon,
        points: [
            'Why no alert yet? The condition is only triggered when current price is less than or equal to your threshold.',
            'Why one alert per crossing? The system avoids duplicate notifications until price moves back above threshold and crosses again.',
            'Why empty watchlist? Add symbols first from the Stocks page.',
        ],
    },
];

const LearnPage: React.FC = () => {
    return (
        <Box sx={{ maxWidth: 1120, mx: 'auto' }}>
            <Stack spacing={3}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 2.5, md: 3.5 },
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'linear-gradient(135deg, rgba(0, 184, 212, 0.14), transparent 46%)',
                            pointerEvents: 'none',
                        }}
                    />
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={3}
                        sx={{
                            position: 'relative',
                            alignItems: { md: 'flex-end' },
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ maxWidth: 720 }}>
                            <Chip
                                icon={<AutoStoriesOutlinedIcon />}
                                label="Learning guide"
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h3" component="h1" gutterBottom>
                                Learn Stock Tracker
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                This page explains how to use the app end-to-end, including
                                watchlist thresholds and notifications.
                            </Typography>
                        </Box>

                        <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            sx={{
                                flexWrap: 'wrap',
                                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                            }}
                        >
                            <Chip label="Account setup" variant="outlined" />
                            <Chip label="Watchlists" variant="outlined" />
                            <Chip label="Portfolio" variant="outlined" />
                        </Stack>
                    </Stack>
                </Paper>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(2, minmax(0, 1fr))',
                        },
                        gap: 2,
                        alignItems: 'stretch',
                    }}
                >
                    {sections.map((section) => {
                        const Icon = section.icon;

                        return (
                            <Paper
                                key={section.title}
                                variant="outlined"
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: 260,
                                    borderColor: 'divider',
                                    transition:
                                        'border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-2px)',
                                        boxShadow: (theme) =>
                                            `0 14px 34px ${theme.palette.action.hover}`,
                                    },
                                }}
                            >
                                <Stack spacing={2} sx={{ flex: 1 }}>
                                    <Stack
                                        direction="row"
                                        spacing={1.5}
                                        sx={{
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 1.5,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                            }}
                                        >
                                            <Icon fontSize="small" />
                                        </Avatar>
                                        <Chip
                                            label={section.step}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Stack>

                                    <Box>
                                        <Typography variant="h6" component="h2">
                                            {section.title}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <List dense disablePadding>
                                        {section.points.map((point) => (
                                            <ListItem
                                                key={point}
                                                disableGutters
                                                sx={{ alignItems: 'flex-start', py: 0.65 }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 30, pt: 0.25 }}>
                                                    <CheckCircleOutlineOutlinedIcon
                                                        color="primary"
                                                        fontSize="small"
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={point}
                                                    slotProps={{
                                                        primary: {
                                                            variant: 'body2',
                                                            color: 'text.secondary',
                                                        },
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Stack>
                            </Paper>
                        );
                    })}
                </Box>
            </Stack>
        </Box>
    );
};

export default LearnPage;

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '@configs/firebase';
import { isGuest } from '@models/userTypes';
import { type RootState } from '@store/store';
import { resetUserInfo } from '@store/userSlice';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus, type Information } from '@models/informationType';
import { InformationDisplay } from './features/informationDisplay/infoSnackBar';
import AlertPoller from './features/Alerts/AlertPoller';
import LogInButton from './components/LogInButton';
import ThemeToggleButton from './components/ThemeToggleButton';
import {
    HeaderRow,
    NavButton,
    PageWrapper,
    NavGroup,
    MobileMenuButton,
    AccountGroup,
    BrandButton,
    AccountButton,
    BalanceBadge,
} from './MainPage.styles';

import { getUnreadNotifications, markNotificationAsRead } from '@api/notificationsApi';

const NOTIFICATION_POLL_INTERVAL_MS = 15000;

const primaryNavItems = [
    { label: 'About Us', path: '/about', icon: <InfoOutlinedIcon fontSize="small" /> },
    { label: 'Learn', path: '/learn', icon: <SchoolOutlinedIcon fontSize="small" /> },
    {
        label: 'Stocks',
        path: '/stocks',
        icon: <ShowChartIcon fontSize="small" />,
        dataTestId: 'nav-stocks',
    },
    { label: 'Donate', path: '/donate', icon: <VolunteerActivismOutlinedIcon fontSize="small" /> },
];

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => !isGuest(state.userSliceName));
    const userBalance = useSelector((state: RootState) => {
        const balance = state.userSliceName.balance;
        if (typeof balance === 'number') return balance;
        if (typeof balance === 'string') return parseFloat(balance);
        return 0;
    });

    const handleAuthButtonClick = async (): Promise<void> => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        await signOut(auth);
        dispatch(resetUserInfo());

        const infoMess: Information = {
            infoMessage: 'Logged out',
            status: InfoMessageStatus.Success,
        };

        dispatch(addInfo(infoMess));

        navigate('/');
    };

    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = (open: boolean): (() => void) => {
        return (): void => setDrawerOpen(open);
    };

    const handleNavigate = (path: string): void => {
        navigate(path);
    };

    const isActivePath = (path: string): boolean => location.pathname === path;

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        let cancelled = false;

        const checkNotifications = async (): Promise<void> => {
            try {
                const unread = await getUnreadNotifications();
                if (cancelled || unread.length === 0) {
                    return;
                }

                await Promise.allSettled(unread.map((n) => markNotificationAsRead(n.id)));

                const latest = unread[0];
                dispatch(
                    addInfo({
                        infoMessage:
                            unread.length === 1
                                ? latest.message
                                : `${unread.length} threshold alerts reached. Latest: ${latest.message}`,
                        status: InfoMessageStatus.Success,
                    }),
                );
            } catch {
                // Ignore transient notification polling failures.
            }
        };

        void checkNotifications();
        const intervalId = window.setInterval(() => {
            void checkNotifications();
        }, NOTIFICATION_POLL_INTERVAL_MS);

        return (): void => {
            cancelled = true;
            window.clearInterval(intervalId);
        };
    }, [dispatch, isLoggedIn]);

    return (
        <Box sx={PageWrapper} data-testid="app-shell">
            <InformationDisplay />
            <AlertPoller enabled={isLoggedIn} />
            <Box sx={HeaderRow} data-testid="app-header">
                <Button
                    variant="text"
                    size="medium"
                    startIcon={<PaidOutlinedIcon />}
                    onClick={() => handleNavigate('/')}
                    sx={BrandButton}
                >
                    Stock Tracker
                </Button>
                <ThemeToggleButton />

                <IconButton
                    aria-label="open menu"
                    onClick={toggleDrawer(true)}
                    sx={MobileMenuButton}
                    size="large"
                >
                    <MenuRoundedIcon />
                </IconButton>

                <Box sx={{ ...NavGroup, display: { xs: 'none', md: 'flex' } }}>
                    {primaryNavItems.map((item) => (
                        <Button
                            key={item.path}
                            variant={isActivePath(item.path) ? 'contained' : 'text'}
                            size="medium"
                            startIcon={item.icon}
                            sx={NavButton}
                            onClick={() => handleNavigate(item.path)}
                            data-testid={item.dataTestId}
                        >
                            {item.label}
                        </Button>
                    ))}
                    {isLoggedIn && (
                        <Button
                            variant={isActivePath('/compare') ? 'contained' : 'text'}
                            size="medium"
                            startIcon={<CompareArrowsIcon fontSize="small" />}
                            sx={NavButton}
                            onClick={() => handleNavigate('/compare')}
                            data-testid="nav-compare"
                        >
                            Compare
                        </Button>
                    )}
                </Box>

                <Box sx={AccountGroup}>
                    {isLoggedIn && (
                        <Button
                            variant={isActivePath('/account') ? 'contained' : 'text'}
                            size="medium"
                            startIcon={<AccountCircleOutlinedIcon fontSize="small" />}
                            sx={AccountButton}
                            onClick={() => handleNavigate('/account')}
                            data-testid="nav-account"
                        >
                            Account
                        </Button>
                    )}

                    {isLoggedIn && (
                        <Box sx={BalanceBadge}>
                            <Box sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Balance</Box>
                            <Box sx={{ fontSize: '1rem', fontWeight: 600, color: 'primary.main' }}>
                                ${userBalance.toFixed(2)}
                            </Box>
                        </Box>
                    )}

                    <LogInButton isLoggedIn={isLoggedIn} onClick={handleAuthButtonClick} />
                </Box>

                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                    <Box
                        sx={{ width: 280, py: 1 }}
                        role="presentation"
                        onClick={toggleDrawer(false)}
                    >
                        <List sx={{ px: 1 }}>
                            {[
                                {
                                    label: 'Home',
                                    path: '/',
                                    icon: <HomeOutlinedIcon fontSize="small" />,
                                },
                                ...primaryNavItems,
                            ].map((item) => (
                                <ListItem key={item.path} disablePadding>
                                    <ListItemButton
                                        selected={isActivePath(item.path)}
                                        onClick={() => handleNavigate(item.path)}
                                        sx={{ borderRadius: 1.5, mb: 0.5 }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.label} />
                                    </ListItemButton>
                                </ListItem>
                            ))}

                            {isLoggedIn && (
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={isActivePath('/compare')}
                                        onClick={() => handleNavigate('/compare')}
                                        sx={{ borderRadius: 1.5, mb: 0.5 }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                                            <CompareArrowsIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Compare" />
                                    </ListItemButton>
                                </ListItem>
                            )}

                            {isLoggedIn && (
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={isActivePath('/account')}
                                        onClick={() => handleNavigate('/account')}
                                        sx={{ borderRadius: 1.5, mb: 0.5 }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                                            <AccountCircleOutlinedIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Account" />
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </List>
                    </Box>
                </Drawer>
            </Box>
            <Outlet />
        </Box>
    );
};

export default MainPage;

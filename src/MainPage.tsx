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
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
} from './MainPage.styles';
    
import { getUnreadNotifications, markNotificationAsRead } from '@api/notificationsApi';

const NOTIFICATION_POLL_INTERVAL_MS = 15000;

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
    const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

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
                    size="large"
                    onClick={() => handleNavigate('/')}
                    sx={{
                        p: 0,
                        minWidth: 'auto',
                        textTransform: 'none',
                        color: 'text.primary',
                        fontSize: '2.125rem',
                        fontWeight: 400,
                        lineHeight: 1.235,
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    Stock Tracker
                </Button>
                {/* Light mode (sun) next to title */}
                <ThemeToggleButton />

                {/* Mobile menu button */}
                <IconButton aria-label="open menu" onClick={toggleDrawer(true)} sx={MobileMenuButton} size="large">
                    <MenuIcon />
                </IconButton>

                {/* Primary navigation (hidden on mobile) */}
                <Box sx={{ ...NavGroup, display: { xs: 'none', md: 'flex' } }}>
                    <Button
                        variant={isActivePath('/about') ? 'contained' : 'outlined'}
                        size="large"
                        sx={NavButton}
                        onClick={() => handleNavigate('/about')}
                    >
                        About Us
                    </Button>
                    <Button
                        variant={isActivePath('/learn') ? 'contained' : 'outlined'}
                        size="large"
                        sx={NavButton}
                        onClick={() => handleNavigate('/learn')}
                    >
                        Learn
                    </Button>
                    <Button
                        variant={isActivePath('/stocks') ? 'contained' : 'outlined'}
                        size="large"
                        sx={NavButton}
                        onClick={() => handleNavigate('/stocks')}
                        data-testid="nav-stocks"
                    >
                        Stocks
                    </Button>
                    <Button
                        variant={isActivePath('/donate') ? 'contained' : 'outlined'}
                        size="large"
                        sx={NavButton}
                        onClick={() => handleNavigate('/donate')}
                    >
                        Donate
                    </Button>
                    {isLoggedIn && (
                        <Button
                            variant={isActivePath('/compare') ? 'contained' : 'outlined'}
                            size="large"
                            sx={NavButton}
                            onClick={() => handleNavigate('/compare')}
                            data-testid="nav-compare"
                        >
                            Compare
                        </Button>
                    )}
                </Box>

                {/* Account / actions group */}
                <Box sx={AccountGroup}>
                    {isLoggedIn && (
                        <Button
                            variant={isActivePath('/account') ? 'contained' : 'outlined'}
                            size="medium"
                            sx={{ minWidth: 92 }}
                            onClick={() => handleNavigate('/account')}
                            data-testid="nav-account"
                        >
                            Account
                        </Button>
                    )}

                    {isLoggedIn && (
                        <Box
                            sx={{
                                px: 1.25,
                                py: 0.5,
                                backgroundColor: 'action.hover',
                                borderRadius: 1,
                                minWidth: 100,
                                textAlign: 'center',
                            }}
                        >
                            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Balance</Box>
                            <Box sx={{ fontSize: '1rem', fontWeight: 600, color: 'primary.main' }}>
                                ${userBalance.toFixed(2)}
                            </Box>
                        </Box>
                    )}

                    <LogInButton isLoggedIn={isLoggedIn} onClick={handleAuthButtonClick} />
                </Box>

                {/* Mobile drawer */}
                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                    <Box sx={{ width: 260 }} role="presentation" onClick={toggleDrawer(false)}>
                        <List>
                            {[
                                { label: 'Home', path: '/' },
                                { label: 'About Us', path: '/about' },
                                { label: 'Learn', path: '/learn' },
                                { label: 'Stocks', path: '/stocks' },
                                { label: 'Donate', path: '/donate' },
                            ].map((item) => (
                                <ListItem key={item.path} disablePadding>
                                    <ListItemButton
                                        selected={isActivePath(item.path)}
                                        onClick={() => handleNavigate(item.path)}
                                    >
                                        <ListItemText primary={item.label} />
                                    </ListItemButton>
                                </ListItem>
                            ))}

                            {isLoggedIn && (
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={isActivePath('/compare')}
                                        onClick={() => handleNavigate('/compare')}
                                    >
                                        <ListItemText primary="Compare" />
                                    </ListItemButton>
                                </ListItem>
                            )}

                            {isLoggedIn && (
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={isActivePath('/account')}
                                        onClick={() => handleNavigate('/account')}
                                    >
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

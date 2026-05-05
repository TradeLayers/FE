import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Box, Button, Chip } from '@mui/material';
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
import { HeaderActions, HeaderRow, NavButton, PageWrapper } from './MainPage.styles';
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
                <Box sx={HeaderActions}>
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
                    {isLoggedIn && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                variant={isActivePath('/account') ? 'contained' : 'outlined'}
                                size="large"
                                sx={NavButton}
                                onClick={() => handleNavigate('/account')}
                                data-testid="nav-account"
                            >
                                Account
                            </Button>
                            <Chip
                                label={`$${userBalance.toFixed(2)}`}
                                color="primary"
                                variant="outlined"
                                size="medium"
                                sx={{ fontWeight: 600 }}
                                aria-label="Available balance"
                            />
                        </Box>
                    )}
                    {isLoggedIn && (
                        <Box
                            sx={{
                                px: 2,
                                py: 1,
                                backgroundColor: 'action.hover',
                                borderRadius: 1,
                                minWidth: 120,
                                textAlign: 'center',
                            }}
                        >
                            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                Balance
                            </Box>
                            <Box
                                sx={{ fontSize: '1.25rem', fontWeight: 600, color: 'primary.main' }}
                            >
                                ${userBalance.toFixed(2)}
                            </Box>
                        </Box>
                    )}
                    <LogInButton isLoggedIn={isLoggedIn} onClick={handleAuthButtonClick} />
                </Box>
            </Box>
            <Outlet />
        </Box>
    );
};

export default MainPage;

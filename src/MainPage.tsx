import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '@configs/firebase';
import { isGuest } from '@models/userTypes';
import { type RootState } from '@store/store';
import { resetUserInfo } from '@store/userSlice';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus, type Information } from '@models/informationType';
import { InformationDisplay } from './features/informationDisplay/infoSnackBar';
import LogInButton from './components/LogInButton';
import { HeaderActions, HeaderRow, NavButton, PageWrapper } from './MainPage.styles';

const isGuest = (user: { name?: string }): boolean => user.name === 'Guest';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => !isGuest(state.userSliceName));

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

    return (
        <Box sx={PageWrapper}>
            <InformationDisplay />
            <Box sx={HeaderRow}>
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
                    {isLoggedIn && (
                        <Button
                            variant={isActivePath('/account') ? 'contained' : 'outlined'}
                            size="large"
                            sx={NavButton}
                            onClick={() => handleNavigate('/account')}
                        >
                            Account
                        </Button>
                    )}
                    <LogInButton isLoggedIn={isLoggedIn} onClick={handleAuthButtonClick} />
                </Box>
            </Box>
            <Outlet />
        </Box>
    );
};

export default MainPage;

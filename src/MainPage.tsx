import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '@configs/firebase';
import { UserType } from '@models/userTypes';
import { type RootState } from '@store/store';
import { resetUserInfo } from '@store/userSlice';
import LogInButton from './components/LogInButton';
import { HeaderActions, HeaderRow, NavButton, PageWrapper } from './MainPage.styles';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const userType = useSelector((state: RootState) => state.userSliceName.userType);
    const isLoggedIn = userType !== UserType.Guest;

    const handleAuthButtonClick = async (): Promise<void> => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        await signOut(auth);
        dispatch(resetUserInfo());
        navigate('/');
    };

    const handleNavigate = (path: string): void => {
        navigate(path);
    };

    const isActivePath = (path: string): boolean => location.pathname === path;

    return (
        <Box sx={PageWrapper}>
            <Box sx={HeaderRow}>
                <Typography variant="h4" component="h1">
                    Stock Tracker
                </Typography>
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
                    <LogInButton isLoggedIn={isLoggedIn} onClick={handleAuthButtonClick} />
                </Box>
            </Box>
            <Outlet />
        </Box>
    );
};

export default MainPage;

import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '@configs/firebase';
import { UserType } from '@models/userTypes';
import { type RootState } from '@store/store';
import { resetUserInfo } from '@store/userSlice';
import LogInButton from './components/LogInButton';
import { HeaderRow, PageWrapper } from './MainPage.styles';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userType = useSelector((state: RootState) => state.userSliceName.userType);
    const isLoggedIn = userType !== UserType.Guest;

    const handleAuthButtonClick = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        await signOut(auth);
        dispatch(resetUserInfo());
        navigate('/');
    };

    return (
        <Box sx={PageWrapper}>
            <Box sx={HeaderRow}>
                <Typography variant="h4" component="h1">
                    Stock Tracker
                </Typography>
                <LogInButton isLoggedIn={isLoggedIn} onClick={handleAuthButtonClick} />
            </Box>
            <Outlet />
        </Box>
    );
};

export default MainPage;

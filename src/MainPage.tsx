import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '@configs/firebase';
import { type RootState } from '@store/store';
import { resetUserInfo } from '@store/userSlice';
import LogInButton from './components/LogInButton';
import { InformationDisplay } from './features/informationDisplay/infoSnackBar';
import { HeaderRow, PageWrapper } from './MainPage.styles';
import { isGuest } from '@models/userTypes';
import { InfoMessageStatus, type Information } from '@models/informationType';
import { addInfo } from '@store/informationSplice';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => !isGuest(state.userSliceName));

    const handleAuthButtonClick = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        await signOut(auth);
        dispatch(resetUserInfo());

        const infoMess: Information = {
            infoMessage: 'Logged out',
            status: InfoMessageStatus.Success
        }

        dispatch(addInfo(infoMess))

        navigate('/');
    };

    return (
        <Box sx={PageWrapper}>
            <InformationDisplay />
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

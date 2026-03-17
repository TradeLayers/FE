import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '@configs/firebase';
import { UserType } from '@models/userTypes';
import { type RootState } from '@store/store';
import { resetUserInfo } from '@store/userSlice';

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
        <Box sx={{ p: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
                <Typography variant="h4" component="h1">
                    Stock Tracker
                </Typography>
                <Button
                    variant="outlined"
                    size="large"
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        backgroundColor: '#16171dff',
                    }}
                    onClick={handleAuthButtonClick}
                >
                    {isLoggedIn ? 'Log Out' : 'Log In'}
                </Button>
            </Box>
            <Outlet />
        </Box>
    );
};

export default MainPage;

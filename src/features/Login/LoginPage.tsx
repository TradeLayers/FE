import { Box, Divider } from '@mui/material';
import { SignUp } from './SignUp';
import { EmailPasswordForm } from './EmailPasswordForm';

const LoginPage: React.FC = () => {
    return (
        <Box
            data-testid="login-page"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                maxWidth: 480,
                mx: 'auto',
            }}
        >
            <SignUp />
            <Divider sx={{ width: '100%', my: 3 }}>or with email</Divider>
            <EmailPasswordForm />
        </Box>
    );
};

export default LoginPage;

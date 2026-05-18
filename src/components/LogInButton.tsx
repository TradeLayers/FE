import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Button } from '@mui/material';

import { AuthButton } from '../MainPage.styles';

type LogInButtonProps = {
    isLoggedIn: boolean;
    onClick: () => void | Promise<void>;
};

const LogInButton: React.FC<LogInButtonProps> = ({ isLoggedIn, onClick }) => {
    return (
        <Button
            variant={isLoggedIn ? 'outlined' : 'contained'}
            size="medium"
            startIcon={isLoggedIn ? <LogoutOutlinedIcon /> : <LoginOutlinedIcon />}
            sx={AuthButton}
            onClick={onClick}
            data-testid={isLoggedIn ? 'logout-button' : 'login-link'}
        >
            {isLoggedIn ? 'Log Out' : 'Log In'}
        </Button>
    );
};

export default LogInButton;

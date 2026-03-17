import { Button } from '@mui/material';

import { AuthButton } from '../MainPage.styles';

type LogInButtonProps = {
    isLoggedIn: boolean;
    onClick: () => void | Promise<void>;
};

const LogInButton: React.FC<LogInButtonProps> = ({ isLoggedIn, onClick }) => {
    return (
        <Button variant="outlined" size="large" sx={AuthButton} onClick={onClick}>
            {isLoggedIn ? 'Log Out' : 'Log In'}
        </Button>
    );
};

export default LogInButton;

import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from '@configs/firebase';
import { InfoMessageStatus } from '@models/informationType';
import { addInfo } from '@store/informationSplice';

import { Box, Typography, Button, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

import { Title, Description, AdditionalInfo, AuthOptions } from './SignUp.styles';
import { finalizeLogin, mapFirebaseAuthError } from './authHelpers';

export const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const signInWithProvider = async (
        provider: GoogleAuthProvider | GithubAuthProvider,
    ): Promise<void> => {
        try {
            await signInWithPopup(auth, provider);
            await finalizeLogin(dispatch, navigate);
        } catch (err: unknown) {
            const code =
                err instanceof Error && 'code' in err
                    ? String((err as { code: string }).code)
                    : String(err);
            dispatch(
                addInfo({
                    infoMessage: mapFirebaseAuthError(code),
                    status: InfoMessageStatus.Error,
                }),
            );
        }
    };

    const handleGoogleAuth = async (): Promise<void> => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        signInWithProvider(provider);
    };

    const handleGitHubAuth = async (): Promise<void> => {
        const provider = new GithubAuthProvider();
        provider.addScope('user:email');
        signInWithProvider(provider);
    };

    return (
        <Box sx={Title}>
            <Box sx={Description}>
                <Typography variant="h2" textAlign="center" color="primary.main">
                    Stock Tracker
                </Typography>

                <Typography variant="h5" textAlign="center" sx={AdditionalInfo}>
                    Register or Log in to your account
                </Typography>
                <Typography
                    variant="body2"
                    fontStyle={'italic'}
                    textAlign="center"
                    sx={AdditionalInfo}
                >
                    (New users will be registered automatically; existing users will be logged in.)
                </Typography>

                <Box sx={AuthOptions}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleAuth}
                    >
                        Google
                    </Button>

                    <Divider sx={{ my: 2 }}>or</Divider>

                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<GitHubIcon />}
                        onClick={handleGitHubAuth}
                    >
                        GitHub
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

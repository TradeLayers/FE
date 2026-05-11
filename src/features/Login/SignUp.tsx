import { useState } from 'react';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { auth } from '@configs/firebase';
import { InfoMessageStatus, type Information } from '@models/informationType';
import { addInfo } from '@store/informationSplice';

import { Box, Typography, Button, Divider, Link, TextField } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

import ForgotPasswordDialog from './ForgotPasswordDialog';
import { getAuthErrorCode, isValidEmail } from './authHelpers';
import {
    Title,
    Description,
    AdditionalInfo,
    FormSection,
    ForgotPasswordRow,
    AuthOptions,
} from './SignUp.styles';

export const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isPasswordSignInPending, setIsPasswordSignInPending] = useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

    const pushSuccessMessage = (message: string): void => {
        const infoMess: Information = {
            infoMessage: message,
            status: InfoMessageStatus.Success,
        };

        dispatch(addInfo(infoMess));
    };

    const signInWithProvider = async (
        provider: GoogleAuthProvider | GithubAuthProvider,
    ): Promise<void> => {
        try {
            await signInWithPopup(auth, provider);
            pushSuccessMessage('Successfully logged in');
            navigate('/');
        } catch (err: unknown) {
            if (import.meta.env.DEV) {
                console.error(err);
            }
        }
    };

    const resetLoginErrors = (): void => {
        setEmailError('');
        setPasswordError('');
        setLoginError('');
    };

    const handlePasswordAuth = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const trimmedEmail = email.trim();
        let hasError = false;

        resetLoginErrors();

        if (!isValidEmail(trimmedEmail)) {
            setEmailError('Enter a valid email address.');
            hasError = true;
        }

        if (!password) {
            setPasswordError('Enter your password.');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setIsPasswordSignInPending(true);

        try {
            await signInWithEmailAndPassword(auth, trimmedEmail, password);
            pushSuccessMessage('Successfully logged in');
            navigate('/');
        } catch (error: unknown) {
            const errorCode = getAuthErrorCode(error);

            if (errorCode === 'auth/invalid-email') {
                setEmailError('Enter a valid email address.');
            } else if (
                errorCode === 'auth/invalid-credential' ||
                errorCode === 'auth/invalid-login-credentials' ||
                errorCode === 'auth/user-not-found' ||
                errorCode === 'auth/wrong-password'
            ) {
                setLoginError('Incorrect email or password.');
            } else {
                setLoginError('Unable to log in right now. Try again later.');
            }
        } finally {
            setIsPasswordSignInPending(false);
        }
    };

    const handleGoogleAuth = (): void => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        void signInWithProvider(provider);
    };

    const handleGitHubAuth = (): void => {
        const provider = new GithubAuthProvider();
        provider.addScope('user:email');
        void signInWithProvider(provider);
    };

    return (
        <Box sx={Title}>
            <Box sx={Description}>
                <Typography variant="h2" textAlign="center" color="primary.main">
                    Stock Tracker
                </Typography>

                <Typography variant="h5" textAlign="center" sx={AdditionalInfo}>
                    Log in to your account
                </Typography>
                <Typography
                    variant="body2"
                    textAlign="center"
                    sx={AdditionalInfo}
                >
                    Use your email and password or continue with Google or GitHub.
                </Typography>

                <Box component="form" onSubmit={(event) => void handlePasswordAuth(event)} noValidate sx={FormSection}>
                    <TextField
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        fullWidth
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            if (emailError || loginError) {
                                setEmailError('');
                                setLoginError('');
                            }
                        }}
                        error={Boolean(emailError)}
                        helperText={emailError || ' '}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        fullWidth
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                            if (passwordError || loginError) {
                                setPasswordError('');
                                setLoginError('');
                            }
                        }}
                        error={Boolean(passwordError)}
                        helperText={passwordError || ' '}
                    />

                    <Box sx={ForgotPasswordRow}>
                        <Link
                            component="button"
                            type="button"
                            variant="body2"
                            onClick={() => setIsResetDialogOpen(true)}
                        >
                            Forgot password?
                        </Link>
                    </Box>

                    {loginError && (
                        <Typography variant="body2" color="error.main">
                            {loginError}
                        </Typography>
                    )}

                    <Button type="submit" variant="contained" fullWidth disabled={isPasswordSignInPending}>
                        Log in
                    </Button>
                </Box>

                <Divider sx={{ my: 3 }}>or continue with</Divider>

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
            <ForgotPasswordDialog
                open={isResetDialogOpen}
                email={email}
                onClose={() => setIsResetDialogOpen(false)}
            />
        </Box>
    );
};

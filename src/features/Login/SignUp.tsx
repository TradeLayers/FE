import { useState } from 'react';
import {
    FacebookAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    type AuthProvider,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createOrFetchUser } from '@api/userApi';
import { auth } from '@configs/firebase';
import { InfoMessageStatus, type Information } from '@models/informationType';
import { addInfo } from '@store/informationSplice';
import { addUserInfo } from '@store/userSlice';

import { Box, Button, CircularProgress, Typography } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import MicrosoftIcon from '@mui/icons-material/Microsoft';

import { Title, Description, AdditionalInfo, AuthOptions } from './SignUp.styles';

type AuthOption = {
    id: string;
    label: string;
    icon: React.ReactElement;
    createProvider: () => AuthProvider;
};

const authOptions: AuthOption[] = [
    {
        id: 'google',
        label: 'Google',
        icon: <GoogleIcon />,
        createProvider: (): AuthProvider => {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            return provider;
        },
    },
    {
        id: 'github',
        label: 'GitHub',
        icon: <GitHubIcon />,
        createProvider: (): AuthProvider => {
            const provider = new GithubAuthProvider();
            provider.addScope('user:email');
            return provider;
        },
    },
    {
        id: 'facebook',
        label: 'Facebook',
        icon: <FacebookIcon />,
        createProvider: (): AuthProvider => {
            const provider = new FacebookAuthProvider();
            provider.addScope('email');
            return provider;
        },
    },
    {
        id: 'microsoft',
        label: 'Microsoft',
        icon: <MicrosoftIcon />,
        createProvider: (): AuthProvider => {
            const provider = new OAuthProvider('microsoft.com');
            provider.setCustomParameters({ prompt: 'select_account' });
            return provider;
        },
    },
    {
        id: 'apple',
        label: 'Apple',
        icon: <AppleIcon />,
        createProvider: (): AuthProvider => {
            const provider = new OAuthProvider('apple.com');
            provider.addScope('email');
            provider.addScope('name');
            return provider;
        },
    },
];

const mapFirebaseAuthError = (code: string): string => {
    if (code.includes('popup-closed-by-user')) return 'Sign-in window was closed';
    if (code.includes('popup-blocked')) return 'Sign-in window was blocked';
    if (code.includes('operation-not-allowed')) return 'This sign-in provider is not enabled';
    if (code.includes('account-exists-with-different-credential')) {
        return 'This account uses a different sign-in provider';
    }
    if (code.includes('network-request-failed')) return 'Network error. Please try again.';
    if (code.includes('invalid-credential')) return 'Sign-in credentials were rejected';
    return code.replace('auth/', '').replace(/-/g, ' ');
};

export const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [busyProvider, setBusyProvider] = useState<string | null>(null);

    const finalizeLogin = async (): Promise<void> => {
        try {
            const usersData = await createOrFetchUser();
            dispatch(addUserInfo(usersData));
        } catch {
            /* AuthListener will retry */
        }

        const infoMess: Information = {
            infoMessage: 'Successfully logged in',
            status: InfoMessageStatus.Success,
        };

        dispatch(addInfo(infoMess));
        navigate('/');
    };

    const signInWithProvider = async (option: AuthOption): Promise<void> => {
        setBusyProvider(option.id);
        try {
            await signInWithPopup(auth, option.createProvider());
            await finalizeLogin();
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
        } finally {
            setBusyProvider(null);
        }
    };

    return (
        <Box data-testid="login-page" sx={Title}>
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
                    {authOptions.map((option) => (
                        <Button
                            key={option.id}
                            variant="outlined"
                            fullWidth
                            startIcon={
                                busyProvider === option.id ? (
                                    <CircularProgress size={18} />
                                ) : (
                                    option.icon
                                )
                            }
                            onClick={() => void signInWithProvider(option)}
                            disabled={busyProvider !== null}
                            data-testid={`auth-provider-${option.id}`}
                        >
                            Continue with {option.label}
                        </Button>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

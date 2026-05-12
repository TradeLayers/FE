import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Link as MuiLink,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import { auth } from '@configs/firebase';
import { finalizeLogin, mapFirebaseAuthError } from './authHelpers';

type Mode = 'login' | 'register' | 'forgot';

const COPY: Record<Mode, { title: string; submitLabel: string; submitTestId: string }> = {
    login: { title: 'Log in', submitLabel: 'Log in', submitTestId: 'login-submit' },
    register: {
        title: 'Create account',
        submitLabel: 'Create account',
        submitTestId: 'register-submit',
    },
    forgot: {
        title: 'Reset password',
        submitLabel: 'Send reset email',
        submitTestId: 'reset-submit',
    },
};

export const EmailPasswordForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const submit = async (): Promise<void> => {
        setError(null);
        setSuccess(null);

        if (mode === 'register' && password !== confirm) {
            setError('Passwords do not match');
            return;
        }

        setBusy(true);
        try {
            if (mode === 'login') {
                await signInWithEmailAndPassword(auth, email, password);
                await finalizeLogin(dispatch, navigate);
            } else if (mode === 'register') {
                await createUserWithEmailAndPassword(auth, email, password);
                await finalizeLogin(dispatch, navigate);
            } else {
                await sendPasswordResetEmail(auth, email);
                setSuccess('Password reset email sent');
            }
        } catch (e: unknown) {
            const code =
                e instanceof Error && 'code' in e
                    ? String((e as { code: string }).code)
                    : String(e);
            setError(mapFirebaseAuthError(code));
        } finally {
            setBusy(false);
        }
    };

    const copy = COPY[mode];

    return (
        <Box data-testid="email-password-form" sx={{ width: '100%', mt: 2 }}>
            <Typography variant="h6" data-testid="auth-mode-title" sx={{ mb: 1 }}>
                {copy.title}
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputProps={{
                        'data-testid': mode === 'forgot' ? 'reset-email' : 'login-email',
                    }}
                    fullWidth
                />
                {mode !== 'forgot' && (
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        inputProps={{ 'data-testid': 'login-password' }}
                        fullWidth
                    />
                )}
                {mode === 'register' && (
                    <TextField
                        label="Confirm password"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        inputProps={{ 'data-testid': 'register-confirm-password' }}
                        fullWidth
                    />
                )}
                {error && (
                    <Alert severity="error" data-testid="auth-error">
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" data-testid="auth-success">
                        {success}
                    </Alert>
                )}
                <Button
                    variant="contained"
                    onClick={submit}
                    disabled={busy}
                    data-testid={copy.submitTestId}
                    fullWidth
                >
                    {busy ? <CircularProgress size={20} /> : copy.submitLabel}
                </Button>
                <Stack direction="row" justifyContent="space-between">
                    {mode === 'login' && (
                        <MuiLink
                            component="button"
                            onClick={() => setMode('forgot')}
                            data-testid="forgot-password-link"
                        >
                            Forgot password?
                        </MuiLink>
                    )}
                    <MuiLink
                        component="button"
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        data-testid="register-toggle"
                    >
                        {mode === 'login' ? 'Create account' : 'Have an account? Log in'}
                    </MuiLink>
                </Stack>
            </Stack>
        </Box>
    );
};

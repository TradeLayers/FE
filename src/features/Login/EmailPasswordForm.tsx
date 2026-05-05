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
import { addInfo } from '@store/informationSplice';
import { addUserInfo } from '@store/userSlice';
import { createOrFetchUser } from '@api/userApi';
import { InfoMessageStatus } from '@models/informationType';

type Mode = 'login' | 'register' | 'forgot';

const friendly = (code: string): string => {
    if (code.includes('invalid-email')) return 'Invalid email address';
    if (code.includes('weak-password')) return 'Password is too weak (min 6 characters)';
    if (code.includes('email-already-in-use')) return 'Email already in use';
    if (code.includes('wrong-password') || code.includes('invalid-credential'))
        return 'Wrong email or password';
    if (code.includes('user-not-found')) return 'No account with that email';
    if (code.includes('missing-password')) return 'Password is required';
    return code.replace('auth/', '').replace(/-/g, ' ');
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
            } else if (mode === 'register') {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await sendPasswordResetEmail(auth, email);
                setSuccess('Password reset email sent');
                setBusy(false);
                return;
            }

            try {
                const dbUser = await createOrFetchUser();
                dispatch(addUserInfo(dbUser));
            } catch {
                /* swallow; AuthListener will retry */
            }
            dispatch(
                addInfo({
                    infoMessage: 'Successfully logged in',
                    status: InfoMessageStatus.Success,
                }),
            );
            navigate('/');
        } catch (e: unknown) {
            const code =
                e instanceof Error && 'code' in e
                    ? String((e as { code: string }).code)
                    : String(e);
            setError(friendly(code));
        } finally {
            setBusy(false);
        }
    };

    return (
        <Box data-testid="email-password-form" sx={{ width: '100%', mt: 2 }}>
            <Typography variant="h6" data-testid="auth-mode-title" sx={{ mb: 1 }}>
                {mode === 'login'
                    ? 'Log in'
                    : mode === 'register'
                      ? 'Create account'
                      : 'Reset password'}
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
                    data-testid={
                        mode === 'login'
                            ? 'login-submit'
                            : mode === 'register'
                              ? 'register-submit'
                              : 'reset-submit'
                    }
                    fullWidth
                >
                    {busy ? (
                        <CircularProgress size={20} />
                    ) : mode === 'login' ? (
                        'Log in'
                    ) : mode === 'register' ? (
                        'Create account'
                    ) : (
                        'Send reset email'
                    )}
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

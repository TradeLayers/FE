import { useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  type User as FirebaseUser,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from '@configs/firebase';
import { type User, UserType } from '@models/userTypes';
import { addUserInfo } from '@store/userSlice';
import { protectedApi } from '@api/axiosConfig';

import {
  Box, Typography, TextField, Button, Divider, Link, Alert, CircularProgress,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

const buildUserFromFirebase = (firebaseUser: FirebaseUser): User => ({
  userType: UserType.User,
  name: firebaseUser.displayName || firebaseUser.email || 'User',
  email: firebaseUser.email || undefined,
  picture: firebaseUser.photoURL || undefined,
});

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSuccess = (firebaseUser: FirebaseUser) => {
    const user = buildUserFromFirebase(firebaseUser);
    dispatch(addUserInfo(user));
    protectedApi.get('/user');
    navigate('/');
  };

  const handleEmailAuth = async () => {
    setError('');
    setResetSent(false);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = isSignUp
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      handleSuccess(result.user);
    } catch (err: any) {
      const code = err.code as string;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    setError('');
    setResetSent(false);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      handleSuccess(result.user);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed.');
      }
    }
  };

  const signUpWithGitHub = async () => {
    setError('');
    setResetSent(false);
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      handleSuccess(result.user);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'GitHub sign-in failed.');
      }
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setResetSent(false);
    if (!email) {
      setError('Enter your email address first, then click "Forgot password?"');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to send reset email.');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: 4,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        <Typography variant="h4" fontWeight={700} textAlign="center" color="text.primary">
          StockTracker
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1, mb: 3 }}>
          {isSignUp ? 'Create your account' : 'Log in to your account'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {resetSent && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setResetSent(false)}>
            Check your email for a password reset link.
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mt: 2 }}
        />

        {!isSignUp && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Link
              component="button"
              variant="body2"
              color="secondary"
              underline="hover"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Link>
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 2, mb: 2 }}
          onClick={handleEmailAuth}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : isSignUp ? 'Create account' : 'Log in'}
        </Button>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={signUpWithGoogle}
            disabled={loading}
          >
            Google
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GitHubIcon />}
            onClick={signUpWithGitHub}
            disabled={loading}
          >
            GitHub
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center" sx={{ mt: 3 }} color="text.secondary">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Link
            component="button"
            color="primary"
            underline="hover"
            fontWeight={600}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setResetSent(false);
            }}
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

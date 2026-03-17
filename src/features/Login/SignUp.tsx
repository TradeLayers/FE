import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, type User as FirebaseUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from '@configs/firebase';
import { type User, UserType } from '@models/userTypes';
import { addUserInfo } from '@store/userSlice';
import { protectedApi } from '@api/axiosConfig';

import { Box, Typography, Button, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

import { Title, Description, BoxStyleThird, BoxStyleFourht } from './SignUp.styles';

const buildUserFromFirebase = async (firebaseUser: FirebaseUser): Promise<User> => {
  const FirebaseId = await firebaseUser.getIdToken();

  return {
    userType: UserType.User,
    name: firebaseUser.displayName || firebaseUser.email || 'User',
    firebaseId: FirebaseId,
    email: firebaseUser.email || undefined,
  }
};

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (firebaseUser: FirebaseUser) => {
    const user = await buildUserFromFirebase(firebaseUser);

    dispatch(addUserInfo(user));
    protectedApi.get('/user');
    navigate('/');
  };

  const signUpWithGoogle = async () => {

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      handleSuccess(result.user);
    } catch (err: any) {
      console.error(err);
    }
  };

  const signUpWithGitHub = async () => {
    const provider = new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);

    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <Box sx={Title}>
      <Box sx={Description}>
        <Typography variant="h5" fontSize={40} fontWeight={800} textAlign="center" color="primary.main">
          Stock Tracker
        </Typography>

        <Typography variant="h5" fontSize={20} textAlign="center" sx={BoxStyleThird}>
          Register or Log in into your account
        </Typography>
        <Typography variant="body2" fontStyle={'italic'} textAlign="center" sx={BoxStyleThird}>
          (New users will be registered automatically; existing users will be logged in.)
        </Typography>

        <Box sx={BoxStyleFourht}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={signUpWithGoogle}
          >
            Google
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GitHubIcon />}
            onClick={signUpWithGitHub}
          >
            GitHub
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

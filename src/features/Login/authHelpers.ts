import type { Dispatch } from 'redux';
import { addInfo } from '@store/informationSplice';
import { addUserInfo } from '@store/userSlice';
import { createOrFetchUser } from '@api/userApi';
import { InfoMessageStatus } from '@models/informationType';

export const mapFirebaseAuthError = (code: string): string => {
    if (code.includes('invalid-email')) return 'Invalid email address';
    if (code.includes('weak-password')) return 'Password is too weak (min 6 characters)';
    if (code.includes('email-already-in-use')) return 'Email already in use';
    if (code.includes('wrong-password') || code.includes('invalid-credential'))
        return 'Wrong email or password';
    if (code.includes('user-not-found')) return 'No account with that email';
    if (code.includes('missing-password')) return 'Password is required';
    if (code.includes('popup-closed-by-user')) return 'Sign-in window was closed';
    return code.replace('auth/', '').replace(/-/g, ' ');
};

export const finalizeLogin = async (
    dispatch: Dispatch,
    navigate: (to: string) => void,
): Promise<void> => {
    try {
        const dbUser = await createOrFetchUser();
        dispatch(addUserInfo(dbUser));
    } catch {
        /* AuthListener will retry */
    }
    dispatch(addInfo({ infoMessage: 'Successfully logged in', status: InfoMessageStatus.Success }));
    navigate('/');
};

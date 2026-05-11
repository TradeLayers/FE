import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useDispatch } from 'react-redux';

import { auth } from '@configs/firebase';
import { InfoMessageStatus } from '@models/informationType';
import { addInfo } from '@store/informationSplice';

import { getAuthErrorCode, isValidEmail } from './authHelpers';

type ForgotPasswordDialogProps = {
    open: boolean;
    email: string;
    onClose: () => void;
};

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, email, onClose }) => {
    const dispatch = useDispatch();
    const [resetEmail, setResetEmail] = useState(email);
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setResetEmail(email.trim());
        setEmailError('');
    }, [email, open]);

    const handleClose = (force = false): void => {
        if (isSubmitting && !force) {
            return;
        }

        setEmailError('');
        onClose();
    };

    const handleSubmit = async (): Promise<void> => {
        const trimmedEmail = resetEmail.trim();

        if (!isValidEmail(trimmedEmail)) {
            setEmailError('Enter a valid email address.');
            return;
        }

        setIsSubmitting(true);

        try {
            await sendPasswordResetEmail(auth, trimmedEmail);
            dispatch(
                addInfo({
                    infoMessage:
                        'If an account exists for that email, a password reset email has been sent.',
                    status: InfoMessageStatus.Success,
                }),
            );
            handleClose(true);
        } catch (error: unknown) {
            const errorCode = getAuthErrorCode(error);

            if (errorCode === 'auth/invalid-email') {
                setEmailError('Enter a valid email address.');
                return;
            }

            if (errorCode === 'auth/user-not-found') {
                dispatch(
                    addInfo({
                        infoMessage:
                            'If an account exists for that email, a password reset email has been sent.',
                        status: InfoMessageStatus.Success,
                    }),
                );
                handleClose(true);
                return;
            }

            dispatch(
                addInfo({
                    infoMessage: 'Unable to send a password reset email right now. Try again later.',
                    status: InfoMessageStatus.Error,
                }),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => handleClose()} fullWidth maxWidth="xs">
            <DialogTitle>Reset password</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    value={resetEmail}
                    onChange={(event) => {
                        setResetEmail(event.target.value);
                        if (emailError) {
                            setEmailError('');
                        }
                    }}
                    error={Boolean(emailError)}
                    helperText={emailError || ' '}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button onClick={() => void handleSubmit()} variant="contained" disabled={isSubmitting}>
                    Send reset email
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ForgotPasswordDialog;

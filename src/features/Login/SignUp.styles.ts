import { type SxProps, type Theme } from '@mui/material';

export const Title: SxProps<Theme> = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'background.default',
    px: 2,
};

export const Description: SxProps<Theme> = {
    width: '100%',
    maxWidth: 520,
    color: 'text.primary',
    bgcolor: 'background.paper',
    borderRadius: 3,
    p: 4,
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
};

export const AdditionalInfo: SxProps<Theme> = {
    mt: 1,
    color: 'text.secondary',
};

export const FormSection: SxProps<Theme> = {
    mt: 3,
    display: 'grid',
    gap: 2,
};

export const ForgotPasswordRow: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: -1,
};

export const AuthOptions: SxProps<Theme> = {
    display: 'grid',
    gap: 2,
    color: 'text.primary',
};

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
    maxWidth: 600,
    color: 'primary.secondary',
    bgcolor: 'background.paper',
    borderRadius: 3,
    p: 4,
    fontSize: 20,
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
};

export const AdditionalInfo: SxProps<Theme> = {
    mt: 1,
    mb: 3,
    color: 'primary.secondary',
};

export const AuthOptions: SxProps<Theme> = {
    display: 'flex',
    gap: 2,
    color: 'ffffff',
};

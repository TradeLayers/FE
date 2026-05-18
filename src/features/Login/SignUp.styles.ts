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
    color: 'text.primary',
    bgcolor: 'background.paper',
    borderRadius: 2,
    p: 4,
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
};

export const AdditionalInfo: SxProps<Theme> = {
    mt: 1,
    mb: 3,
    color: 'text.secondary',
};

export const AuthOptions: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, minmax(0, 1fr))',
    },
    gap: 1.5,
    color: 'text.primary',
};

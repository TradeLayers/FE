import { type SxProps, type Theme } from '@mui/material';

export const PageWrapper: SxProps<Theme> = {
    p: 3,
};

export const HeaderRow: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
};

export const AuthButton: SxProps<Theme> = {
    px: 4,
    py: 1.5,
    backgroundColor: 'background.paper',
};

import { type SxProps, type Theme } from '@mui/material';

export const PageWrapper: SxProps<Theme> = {
    p: 3,
};

export const HeaderRow: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
    gap: 2,
    flexWrap: 'wrap',
};

export const HeaderActions: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexWrap: 'wrap',
};

export const NavButton: SxProps<Theme> = {
    minWidth: 110,
};

export const AuthButton: SxProps<Theme> = {
    px: 4,
    py: 1.5,
    backgroundColor: 'background.paper',
};

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
    flexWrap: 'nowrap',
};

export const HeaderActions: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexShrink: 0,
};

export const NavButton: SxProps<Theme> = {
    minWidth: 110,
};

export const NavGroup: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flex: 1,
    overflowX: 'auto',
    '& > button': { flexShrink: 0 },
};

export const MobileMenuButton: SxProps<Theme> = {
    display: { xs: 'inline-flex', md: 'none' },
    ml: 1,
};

export const AccountGroup: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    ml: 2,
};

export const AuthButton: SxProps<Theme> = {
    px: 4,
    py: 1.5,
    backgroundColor: 'background.paper',
};

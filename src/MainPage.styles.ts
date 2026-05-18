import { type SxProps, type Theme } from '@mui/material';

export const PageWrapper: SxProps<Theme> = {
    p: { xs: 2, md: 3 },
    pt: { xs: 2, md: 2.5 },
};

export const HeaderRow: SxProps<Theme> = {
    position: 'sticky',
    top: { xs: 8, md: 16 },
    zIndex: (theme) => theme.zIndex.appBar,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
    gap: { xs: 1, md: 1.5 },
    px: { xs: 1, sm: 1.25, md: 1.5 },
    py: 1,
    minHeight: 64,
    flexWrap: 'nowrap',
    bgcolor: (theme) =>
        theme.palette.mode === 'dark' ? 'rgba(22, 23, 29, 0.92)' : 'rgba(255, 255, 255, 0.92)',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    boxShadow: (theme) =>
        theme.palette.mode === 'dark'
            ? '0 18px 44px rgba(0, 0, 0, 0.34)'
            : '0 18px 40px rgba(23, 32, 38, 0.12)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
};

export const HeaderActions: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexShrink: 0,
};

export const NavButton: SxProps<Theme> = {
    height: 40,
    minWidth: 92,
    px: 1.4,
    borderRadius: 1.5,
    color: 'text.secondary',
    whiteSpace: 'nowrap',
    '&.MuiButton-contained': {
        color: 'primary.contrastText',
        boxShadow: 'none',
    },
    '&.MuiButton-text:hover': {
        color: 'text.primary',
        bgcolor: 'action.hover',
    },
    '& .MuiButton-startIcon': {
        mr: 0.75,
    },
};

export const NavGroup: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0.5,
    flex: 1,
    minWidth: 0,
    mx: { md: 0.5, lg: 1 },
    p: 0.5,
    overflowX: 'auto',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    bgcolor: 'action.hover',
    '& > button': { flexShrink: 0 },
};

export const MobileMenuButton: SxProps<Theme> = {
    display: { xs: 'inline-flex', md: 'none' },
    width: 40,
    height: 40,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1.5,
    color: 'text.secondary',
    bgcolor: 'action.hover',
    '&:hover': {
        color: 'text.primary',
        bgcolor: 'action.selected',
    },
};

export const AccountGroup: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: { xs: 0.75, md: 1 },
    ml: { xs: 'auto', md: 0.5 },
    flexShrink: 0,
    minWidth: 0,
};

export const BrandButton: SxProps<Theme> = {
    minWidth: { xs: 0, sm: 190 },
    px: { xs: 1, sm: 1.25 },
    height: 44,
    borderRadius: 1.5,
    textTransform: 'none',
    color: 'text.primary',
    fontSize: { xs: '1.05rem', sm: '1.25rem' },
    fontWeight: 800,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    justifyContent: 'flex-start',
    '&:hover': {
        bgcolor: 'action.hover',
    },
    '& .MuiButton-startIcon': {
        color: 'primary.main',
        mr: { xs: 0.5, sm: 0.75 },
    },
};

export const AccountButton: SxProps<Theme> = {
    ...NavButton,
    display: { xs: 'none', lg: 'inline-flex' },
};

export const BalanceBadge: SxProps<Theme> = {
    display: { xs: 'none', sm: 'block' },
    minWidth: 112,
    px: 1.25,
    py: 0.6,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1.5,
    bgcolor: 'action.hover',
    textAlign: 'left',
    lineHeight: 1.15,
};

export const AuthButton: SxProps<Theme> = {
    height: 40,
    px: { xs: 1.25, sm: 2 },
    borderRadius: 1.5,
    whiteSpace: 'nowrap',
    boxShadow: 'none',
    flexShrink: 0,
    '& .MuiButton-startIcon': {
        mr: { xs: 0.5, sm: 0.75 },
    },
};

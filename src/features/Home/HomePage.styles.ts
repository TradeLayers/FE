import { type SxProps, type Theme } from '@mui/material';

export const Hero: SxProps<Theme> = {
    mb: 3,
};

export const MoversGrid: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: 2,
    alignItems: 'start',
};

export const Panel: SxProps<Theme> = {
    p: 2,
    borderRadius: 2,
    backgroundColor: 'background.paper',
    minHeight: 320,
    display: 'flex',
    flexDirection: 'column',
};

export const PanelTitle: SxProps<Theme> = {
    mb: 1.5,
    fontWeight: 700,
};

export const Rows: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    flex: 1,
};

export const Row: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    px: 1.5,
    py: 1.25,
    borderRadius: 1.5,
    cursor: 'pointer',
    backgroundColor: 'action.hover',
    transition: 'background-color 120ms ease',
    '&:hover': {
        backgroundColor: 'action.selected',
    },
};

export const SymbolBlock: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
};

export const ChangePositive: SxProps<Theme> = {
    color: 'success.main',
    fontWeight: 700,
    whiteSpace: 'nowrap',
};

export const ChangeNegative: SxProps<Theme> = {
    color: 'error.main',
    fontWeight: 700,
    whiteSpace: 'nowrap',
};

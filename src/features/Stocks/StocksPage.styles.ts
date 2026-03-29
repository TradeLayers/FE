import { type SxProps, type Theme } from '@mui/material';

export const PageContainer: SxProps<Theme> = {
    display: 'flex',
    height: 'calc(100vh - 100px)',
    gap: 2,
};

export const LeftPanel: SxProps<Theme> = {
    width: 320,
    minWidth: 320,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'background.paper',
    borderRadius: 2,
    overflow: 'hidden',
};

export const StockList: SxProps<Theme> = {
    flex: 1,
    overflowY: 'auto',
};

export const StockRow: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 2,
    py: 1.5,
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'action.hover',
    },
};

export const StockRowSelected: SxProps<Theme> = {
    ...StockRow,
    backgroundColor: 'action.selected',
    '&:hover': {
        backgroundColor: 'action.selected',
    },
};

export const RightPanel: SxProps<Theme> = {
    flex: 1,
    backgroundColor: 'background.paper',
    borderRadius: 2,
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
};

export const ProfileHeader: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 3,
    width: '100%',
};

export const ProfileDetails: SxProps<Theme> = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
};

export const DetailRow: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

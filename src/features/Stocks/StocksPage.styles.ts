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
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    overflowY: 'auto',
};

export const ProfileHeader: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 2,
    mb: 2,
    width: '100%',
    flexWrap: 'wrap',
};

export const ProfileHeaderInfo: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    minWidth: 240,
};

export const ProfileHeaderActions: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
};

export const PriceBlock: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: 140,
};

export const MetricsGrid: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
    gap: 1.5,
    mb: 2,
};

export const MetricCard: SxProps<Theme> = {
    p: 1.5,
    borderRadius: 1.5,
    backgroundColor: 'action.hover',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    minHeight: 64,
};

export const OwnedBanner: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    p: 1.5,
    mb: 2,
    borderRadius: 1.5,
    backgroundColor: 'primary.main',
    color: 'primary.contrastText',
    flexWrap: 'wrap',
};

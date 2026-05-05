import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { resetInfo } from '@store/informationSplice';
import { InfoMessageStatus } from '@models/informationType';
import type { RootState } from '@store/store';

import { InfoSnackBarPosition, InfoSnackBarStyle } from './infoSnackBar.styles';

export const InformationDisplay: React.FC = () => {
    const information = useSelector((state: RootState) => state.informationSliceName);
    const dispatch = useDispatch();

    const handleOpen: boolean = information.status !== InfoMessageStatus.None;

    const handleClose = (): void => {
        dispatch(resetInfo());
    };

    return (
        <div data-testid="info-snackbar-root">
            <Snackbar
                ContentProps={{ 'data-testid': 'info-snackbar' } as Record<string, string>}
                slotProps={{
                    content: {
                        sx: InfoSnackBarStyle(information.status),
                    },
                }}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => handleClose()}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
                open={handleOpen}
                onClose={handleClose}
                autoHideDuration={5000}
                anchorOrigin={InfoSnackBarPosition}
                transitionDuration={{ enter: 0, exit: 0 }}
                message={information.infoMessage}
            />
        </div>
    );
};

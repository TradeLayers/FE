import { type SnackbarOrigin } from '@mui/material/Snackbar';
import { type SxProps, type Theme } from '@mui/material';
import { InfoMessageStatus } from '@models/informationType';

export const InfoSnackBarPosition: SnackbarOrigin = {
    vertical: 'top',
    horizontal: 'center',
};

export const InfoSnackBarStyle = (infoType: InfoMessageStatus): SxProps<Theme> => {
    let bgColor = 'info.main';

    if (infoType === InfoMessageStatus.Success) {
        bgColor = 'success.main';
    } else if (infoType === InfoMessageStatus.Error) {
        bgColor = 'error.main';
    }

    return {
        backgroundColor: bgColor,
        color: 'white',
    };
};

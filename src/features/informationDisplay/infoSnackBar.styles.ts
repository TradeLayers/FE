import { type SnackbarOrigin } from '@mui/material/Snackbar';
import { type SxProps, type Theme } from '@mui/material';
import { InfoMessageStatus } from '@models/informationType';

export const InfoSnackBarPosition: SnackbarOrigin = {
    vertical: 'top',
    horizontal: 'center',
}

export const InfoSnackBarStyle = (infoType: InfoMessageStatus): SxProps<Theme> => {
    let bgColor = 'info.main'

    if (infoType === InfoMessageStatus.Success){ 
        bgColor = 'green';
    }
    else if(infoType === InfoMessageStatus.Error){
         bgColor = 'red';
    }

    return {
        backgroundColor: bgColor,
        color: 'white'
    }
}
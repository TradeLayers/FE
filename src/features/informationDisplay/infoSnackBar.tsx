import { useEffect, useRef, useState } from 'react';
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

    const [lastMessage, setLastMessage] = useState('');
    const [lastStatus, setLastStatus] = useState<InfoMessageStatus>(InfoMessageStatus.None);
    const seq = useRef(0);
    useEffect(() => {
        if (information.status !== InfoMessageStatus.None && information.infoMessage) {
            seq.current += 1;
            setLastMessage(information.infoMessage);
            setLastStatus(information.status);
        }
    }, [information.infoMessage, information.status]);

    const handleOpen: boolean = information.status !== InfoMessageStatus.None;

    const handleClose = (): void => {
        dispatch(resetInfo());
    };

    return (
        <div data-testid="info-snackbar-root">
            <div
                data-testid="info-snackbar"
                data-status={lastStatus}
                data-seq={seq.current}
                style={{ position: 'absolute', left: -9999, top: -9999 }}
                aria-hidden="true"
            >
                {lastMessage}
            </div>
            <Snackbar
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

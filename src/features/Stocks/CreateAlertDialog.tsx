import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { createAlert } from '@api/alertsApi';
import { type AlertDirection, type PriceAlert } from '@models/alertTypes';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus } from '@models/informationType';
import { formatCurrency } from '../Account/format';

type Props = {
    open: boolean;
    onClose: () => void;
    symbol: string;
    name: string;
    currentPrice: number;
};

const CreateAlertDialog: React.FC<Props> = ({ open, onClose, symbol, name, currentPrice }) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [thresholdInput, setThresholdInput] = useState(
        currentPrice > 0 ? currentPrice.toFixed(2) : '',
    );
    const [direction, setDirection] = useState<AlertDirection>('above');

    const thresholdPrice = Number(thresholdInput);
    const validThreshold = Number.isFinite(thresholdPrice) && thresholdPrice > 0;

    const mutation = useMutation<PriceAlert>({
        mutationFn: () => createAlert({ symbol, thresholdPrice, direction }),
        onSuccess: () => {
            dispatch(
                addInfo({
                    infoMessage: `${symbol} alert created`,
                    status: InfoMessageStatus.Success,
                }),
            );
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
            onClose();
        },
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Create alert</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {name} ({symbol})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Current price {currentPrice > 0 ? formatCurrency(currentPrice) : '—'}
                    </Typography>
                    <TextField
                        label="Direction"
                        select
                        value={direction}
                        onChange={(event) => setDirection(event.target.value as AlertDirection)}
                        fullWidth
                    >
                        <MenuItem value="above">Above</MenuItem>
                        <MenuItem value="below">Below</MenuItem>
                    </TextField>
                    <TextField
                        label="Threshold price"
                        type="number"
                        value={thresholdInput}
                        onChange={(event) => setThresholdInput(event.target.value)}
                        inputProps={{ min: 0, step: '0.01' }}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={mutation.isPending}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={() => mutation.mutate()}
                    disabled={!validThreshold || mutation.isPending}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateAlertDialog;

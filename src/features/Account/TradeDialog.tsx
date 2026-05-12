import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { buyStock, sellStock } from '@api/portfolioApi';
import { type TradeResult } from '@models/portfolioTypes';
import { addInfo } from '@store/informationSplice';
import { addUserInfo } from '@store/userSlice';
import { InfoMessageStatus } from '@models/informationType';
import { type RootState } from '@store/store';
import { formatCurrency, formatQuantity } from './format';

export type TradeMode = 'buy' | 'sell';

type Props = {
    open: boolean;
    onClose: () => void;
    mode: TradeMode;
    symbol: string;
    name: string;
    currentPrice: number;
    ownedQuantity?: number;
    availableBalance?: number;
};

const TradeDialog: React.FC<Props> = ({
    open,
    onClose,
    mode,
    symbol,
    name,
    currentPrice,
    ownedQuantity,
    availableBalance,
}) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const currentUser = useSelector((state: RootState) => state.userSliceName);
    // Parent conditionally renders this dialog, so useState reinitializes on
    // every mount — no need for an effect to reset quantity on open.
    const [quantityInput, setQuantityInput] = useState('1');

    const quantity = Number(quantityInput);
    const validQuantity = Number.isFinite(quantity) && quantity > 0;
    const estimated = validQuantity ? currentPrice * quantity : 0;

    const exceedsHoldings =
        mode === 'sell' && ownedQuantity !== undefined && quantity > ownedQuantity;
    const exceedsBalance =
        mode === 'buy' && availableBalance !== undefined && estimated > availableBalance;

    const mutation = useMutation<TradeResult, unknown, void>({
        mutationFn: () =>
            mode === 'buy' ? buyStock({ symbol, quantity }) : sellStock({ symbol, quantity }),
        onSuccess: (result) => {
            dispatch(
                addInfo({
                    infoMessage: `${mode === 'buy' ? 'Bought' : 'Sold'} ${formatQuantity(result.transaction.quantity)} ${symbol} @ ${formatCurrency(result.transaction.price)}`,
                    status: InfoMessageStatus.Success,
                }),
            );
            dispatch(addUserInfo({ ...currentUser, balance: result.balance }));
            queryClient.invalidateQueries({ queryKey: ['holdings'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['portfolioHistory'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            onClose();
        },
    });

    const confirmDisabled = !validQuantity || mutation.isPending || currentPrice <= 0;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>
                {mode === 'buy' ? 'Buy' : 'Sell'} {symbol}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {name}
                    </Typography>

                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Current price
                        </Typography>
                        <Typography variant="h6">
                            {currentPrice > 0 ? formatCurrency(currentPrice) : 'Unavailable'}
                        </Typography>
                    </Box>

                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantityInput}
                        onChange={(event) => setQuantityInput(event.target.value)}
                        inputProps={{ min: 0, step: 'any', 'data-testid': 'trade-quantity' }}
                        fullWidth
                    />

                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Estimated {mode === 'buy' ? 'cost' : 'proceeds'}
                        </Typography>
                        <Typography variant="h6">{formatCurrency(estimated)}</Typography>
                    </Box>

                    {mode === 'sell' && ownedQuantity !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                            You own {formatQuantity(ownedQuantity)} {symbol}
                        </Typography>
                    )}

                    {mode === 'buy' && availableBalance !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                            Balance {formatCurrency(availableBalance)}
                        </Typography>
                    )}

                    {exceedsHoldings && (
                        <Alert severity="error">
                            You only own {formatQuantity(ownedQuantity ?? 0)} shares.
                        </Alert>
                    )}
                    {exceedsBalance && (
                        <Alert severity="error">Insufficient balance for this purchase.</Alert>
                    )}
                    {currentPrice <= 0 && (
                        <Alert severity="warning">
                            Live price is unavailable. Try again shortly.
                        </Alert>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={mutation.isPending}>
                    Cancel
                </Button>
                <Button
                    onClick={() => mutation.mutate()}
                    variant="contained"
                    color={mode === 'buy' ? 'primary' : 'error'}
                    disabled={confirmDisabled}
                    data-testid="trade-confirm"
                >
                    Confirm {mode === 'buy' ? 'Buy' : 'Sell'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TradeDialog;

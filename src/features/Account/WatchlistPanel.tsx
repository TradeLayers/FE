import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Alert,
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { getWatchlist, removeFromWatchlist, updateWatchlistThreshold } from '@api/watchlistApi';
import { type WatchlistItem } from '@models/watchlistTypes';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus } from '@models/informationType';
import { formatCurrency } from './format';

const toThresholdInputValue = (value: number | null): string => {
    return value === null ? '' : value.toString();
};

const WatchlistPanel: React.FC = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [thresholdInputs, setThresholdInputs] = useState<Record<string, string>>({});

    const { data, isLoading, error } = useQuery<WatchlistItem[]>({
        queryKey: ['watchlist'],
        queryFn: getWatchlist,
    });

    const removeMutation = useMutation({
        mutationFn: (symbol: string) => removeFromWatchlist(symbol),
        onSuccess: (_, symbol) => {
            dispatch(
                addInfo({
                    infoMessage: `${symbol} removed from watchlist`,
                    status: InfoMessageStatus.Success,
                }),
            );
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
    });

    const updateThresholdMutation = useMutation({
        mutationFn: ({ symbol, thresholdPrice }: { symbol: string; thresholdPrice: number }) =>
            updateWatchlistThreshold(symbol, thresholdPrice),
        onSuccess: (_, variables) => {
            dispatch(
                addInfo({
                    infoMessage: `${variables.symbol} threshold updated`,
                    status: InfoMessageStatus.Success,
                }),
            );
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
        onError: () => {
            dispatch(
                addInfo({
                    infoMessage: 'Failed to update threshold',
                    status: InfoMessageStatus.Error,
                }),
            );
        },
    });

    const thresholdInputDefaults = useMemo(() => {
        const map: Record<string, string> = {};
        for (const item of data ?? []) {
            map[item.symbol] = toThresholdInputValue(item.thresholdPrice);
        }
        return map;
    }, [data]);

    const thresholdBySymbol = useMemo(() => {
        const map: Record<string, number | null> = {};
        for (const item of data ?? []) {
            map[item.symbol] = item.thresholdPrice;
        }
        return map;
    }, [data]);

    const handleThresholdInputChange = (symbol: string, value: string) => {
        setThresholdInputs((prev) => ({
            ...prev,
            [symbol]: value,
        }));
    };

    const handleThresholdSave = (symbol: string) => {
        const rawValue = thresholdInputs[symbol]?.trim() ?? '';
        const parsedValue = Number(rawValue);

        if (rawValue === '' || Number.isNaN(parsedValue) || parsedValue <= 0) {
            dispatch(
                addInfo({
                    infoMessage: 'Threshold price must be greater than zero',
                    status: InfoMessageStatus.Error,
                }),
            );
            return;
        }

        updateThresholdMutation.mutate({ symbol, thresholdPrice: parsedValue });
    };

    const isThresholdSaveDisabled = (symbol: string): boolean => {
        const rawValue = thresholdInputs[symbol]?.trim() ?? '';
        if (rawValue === '') {
            return true;
        }

        const parsedValue = Number(rawValue);
        if (Number.isNaN(parsedValue) || parsedValue <= 0) {
            return true;
        }

        const current = thresholdBySymbol[symbol];
        if (current === null || current === undefined) {
            return false;
        }

        return Math.abs(current - parsedValue) < 0.000001;
    };

    if (isLoading) {
        return <Typography color="text.secondary">Loading watchlist...</Typography>;
    }

    if (error) {
        return <Alert severity="error">Failed to load watchlist.</Alert>;
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    Your watchlist is empty. Add stocks from the Stocks page.
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Threshold</TableCell>
                        <TableCell align="right" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.symbol}>
                            <TableCell>{item.symbol}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">
                                {item.currentPrice > 0 ? formatCurrency(item.currentPrice) : '—'}
                            </TableCell>
                            <TableCell align="right">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={
                                            thresholdInputs[item.symbol] ??
                                            thresholdInputDefaults[item.symbol] ??
                                            ''
                                        }
                                        onChange={(event) =>
                                            handleThresholdInputChange(
                                                item.symbol,
                                                event.target.value,
                                            )
                                        }
                                        inputProps={{ min: 0, step: 0.01 }}
                                        placeholder="0.00"
                                        sx={{ width: 120 }}
                                    />
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleThresholdSave(item.symbol)}
                                        disabled={
                                            updateThresholdMutation.isPending ||
                                            isThresholdSaveDisabled(item.symbol)
                                        }
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </TableCell>
                            <TableCell align="right">
                                <IconButton
                                    size="small"
                                    onClick={() => removeMutation.mutate(item.symbol)}
                                    disabled={removeMutation.isPending}
                                    aria-label={`Remove ${item.symbol}`}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default WatchlistPanel;

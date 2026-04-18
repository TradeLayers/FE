import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import {
    Alert,
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { getWatchlist, removeFromWatchlist } from '@api/watchlistApi';
import { type WatchlistItem } from '@models/watchlistTypes';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus } from '@models/informationType';
import { formatCurrency } from './format';

const WatchlistPanel: React.FC = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

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

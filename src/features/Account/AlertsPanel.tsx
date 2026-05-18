import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import {
    Alert,
    Box,
    Chip,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { deleteAlert, getAlerts } from '@api/alertsApi';
import { type PriceAlert } from '@models/alertTypes';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus } from '@models/informationType';
import { formatCurrency, formatDateTime } from './format';

const AlertsPanel: React.FC = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<PriceAlert[]>({
        queryKey: ['alerts'],
        queryFn: getAlerts,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAlert(id),
        onSuccess: () => {
            dispatch(
                addInfo({
                    infoMessage: 'Alert deleted',
                    status: InfoMessageStatus.Success,
                }),
            );
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
        },
    });

    if (isLoading) {
        return <Typography color="text.secondary">Loading alerts...</Typography>;
    }

    if (error) {
        return <Alert severity="error">Failed to load alerts.</Alert>;
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    You have no price alerts. Create one from the Stocks page.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {/* Desktop table view */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Direction</TableCell>
                                <TableCell align="right">Threshold</TableCell>
                                <TableCell align="right">Current</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right" />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} data-testid="alert-row">
                                    <TableCell>
                                        <Typography fontWeight={600}>{item.symbol}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{item.direction}</TableCell>
                                    <TableCell align="right">
                                        {formatCurrency(item.thresholdPrice)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.currentPrice > 0
                                            ? formatCurrency(item.currentPrice)
                                            : '—'}
                                    </TableCell>
                                    <TableCell>
                                        {item.triggeredAt ? (
                                            <Chip
                                                size="small"
                                                color="success"
                                                label={`Triggered ${formatDateTime(item.triggeredAt)}`}
                                            />
                                        ) : (
                                            <Chip size="small" variant="outlined" label="Active" />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => deleteMutation.mutate(item.id)}
                                            disabled={deleteMutation.isPending}
                                            aria-label={`Delete ${item.symbol} alert`}
                                            data-testid="alert-delete"
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Mobile card view */}
            <Stack sx={{ display: { xs: 'flex', md: 'none' }, gap: 1.5 }}>
                {data.map((item) => (
                    <Paper
                        key={item.id}
                        variant="outlined"
                        sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
                        data-testid="alert-row"
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: 2,
                            }}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography fontWeight={700}>{item.symbol}</Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {item.name}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={() => deleteMutation.mutate(item.id)}
                                disabled={deleteMutation.isPending}
                                aria-label={`Delete ${item.symbol} alert`}
                                data-testid="alert-delete"
                                sx={{ mt: -0.5 }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Direction
                                </Typography>
                                <Typography fontWeight={600}>{item.direction}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Threshold
                                </Typography>
                                <Typography fontWeight={600}>
                                    {formatCurrency(item.thresholdPrice)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Current Price
                                </Typography>
                                <Typography fontWeight={600}>
                                    {item.currentPrice > 0
                                        ? formatCurrency(item.currentPrice)
                                        : '—'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Status
                                </Typography>
                                {item.triggeredAt ? (
                                    <Chip
                                        size="small"
                                        color="success"
                                        label={`Triggered ${formatDateTime(item.triggeredAt)}`}
                                        sx={{ mt: 0.5 }}
                                    />
                                ) : (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label="Active"
                                        sx={{ mt: 0.5 }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Stack>
        </>
    );
};

export default AlertsPanel;

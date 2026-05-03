import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import {
    Alert,
    Box,
    Chip,
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
                        <TableRow key={item.id}>
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
                                {item.currentPrice > 0 ? formatCurrency(item.currentPrice) : '—'}
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

export default AlertsPanel;

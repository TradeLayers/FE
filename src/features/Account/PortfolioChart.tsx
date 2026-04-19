import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Alert,
    Box,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    useTheme,
} from '@mui/material';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { getPortfolioHistory } from '@api/portfolioApi';
import { type PortfolioInterval, type PortfolioHistoryResponse } from '@models/portfolioTypes';
import { formatCurrency } from './format';

const PortfolioChart: React.FC = () => {
    const theme = useTheme();
    const [interval, setInterval] = useState<PortfolioInterval>('all');

    const { data, isLoading, error } = useQuery<PortfolioHistoryResponse>({
        queryKey: ['portfolioHistory', interval],
        queryFn: () => getPortfolioHistory(interval),
    });

    const chartData = useMemo(() => {
        if (!data) return [];
        return data.points.map((p) => ({
            date: new Date(p.date).toLocaleDateString(),
            investedCapital: p.investedCapital,
        }));
    }, [data]);

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems="flex-start"
            >
                <Box>
                    <Typography variant="h6">Portfolio</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Net invested capital over time. Based on your transaction history.
                    </Typography>
                </Box>
                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Typography variant="caption" color="text.secondary">
                        Current market value
                    </Typography>
                    <Typography variant="h6">
                        {data ? formatCurrency(data.currentValue) : '—'}
                    </Typography>
                </Box>
            </Stack>

            <ToggleButtonGroup
                size="small"
                value={interval}
                exclusive
                onChange={(_, v: PortfolioInterval | null) => v && setInterval(v)}
                sx={{ mt: 2, mb: 2 }}
            >
                <ToggleButton value="daily">Daily</ToggleButton>
                <ToggleButton value="weekly">Weekly</ToggleButton>
                <ToggleButton value="monthly">Monthly</ToggleButton>
                <ToggleButton value="all">All</ToggleButton>
            </ToggleButtonGroup>

            {isLoading && <Typography color="text.secondary">Loading...</Typography>}
            {error && <Alert severity="error">Failed to load portfolio history.</Alert>}

            {!isLoading && !error && chartData.length === 0 && (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                    No transactions yet in this interval.
                </Typography>
            )}

            {chartData.length > 0 && (
                <Box sx={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                stroke={theme.palette.text.secondary}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                stroke={theme.palette.text.secondary}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => formatCurrency(Number(value))}
                                width={90}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                                formatter={(value) => formatCurrency(Number(value))}
                            />
                            <Line
                                type="monotone"
                                dataKey="investedCapital"
                                stroke={theme.palette.primary.main}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
};

export default PortfolioChart;

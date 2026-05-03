import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Alert,
    Box,
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

import { getCandles, type CandleResolution } from '@api/stocksApi';
import { formatCurrency } from '../Account/format';

type RangeValue = '1D' | '1W' | '1M' | '1Y' | '5Y';

type Props = {
    symbol: string;
};

const ranges: RangeValue[] = ['1D', '1W', '1M', '1Y', '5Y'];

const StockPriceChart: React.FC<Props> = ({ symbol }) => {
    const theme = useTheme();
    const [range, setRange] = useState<RangeValue>('1M');
    const queryParams = useMemo(() => rangeToQuery(range), [range]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['stockCandles', symbol, range],
        queryFn: () =>
            getCandles([symbol], queryParams.resolution, queryParams.fromUnix, queryParams.toUnix),
        enabled: !!symbol,
    });

    const chartData = useMemo(() => {
        const series = data?.series?.[symbol];
        if (!series) return [];
        return series.t
            .map((timestamp, index) => ({
                date: formatTick(timestamp, range),
                close: series.c[index],
            }))
            .filter((point) => Number.isFinite(point.close) && point.close > 0);
    }, [data, range, symbol]);

    return (
        <Box sx={{ mt: 3, width: '100%', maxWidth: 1100, alignSelf: 'center' }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', sm: 'center' }}
                spacing={1.5}
                sx={{ mb: 1.5 }}
            >
                <Typography variant="h6">Price history</Typography>
                <ToggleButtonGroup
                    size="small"
                    value={range}
                    exclusive
                    onChange={(_, value: RangeValue | null) => value && setRange(value)}
                >
                    {ranges.map((value) => (
                        <ToggleButton key={value} value={value}>
                            {value}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Stack>

            {isLoading && <Typography color="text.secondary">Loading chart...</Typography>}
            {error && <Alert severity="error">Failed to load price history.</Alert>}
            {!isLoading && !error && chartData.length === 0 && (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                    No price history available for this range.
                </Typography>
            )}

            {chartData.length > 0 && (
                <Box sx={{ width: '100%', height: { xs: 320, md: 380 } }}>
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
                                domain={['dataMin', 'dataMax']}
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
                                dataKey="close"
                                stroke={theme.palette.success.main}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Box>
    );
};

function rangeToQuery(range: RangeValue): {
    resolution: CandleResolution;
    fromUnix: number;
    toUnix: number;
} {
    const to = Math.floor(Date.now() / 1000);
    const day = 24 * 60 * 60;
    switch (range) {
        case '1D':
            return { resolution: '60', fromUnix: to - day, toUnix: to };
        case '1W':
            return { resolution: 'D', fromUnix: to - 7 * day, toUnix: to };
        case '1M':
            return { resolution: 'D', fromUnix: to - 30 * day, toUnix: to };
        case '1Y':
            return { resolution: 'W', fromUnix: to - 365 * day, toUnix: to };
        case '5Y':
            return { resolution: 'M', fromUnix: to - 5 * 365 * day, toUnix: to };
    }
}

function formatTick(timestamp: number, range: RangeValue): string {
    const date = new Date(timestamp * 1000);
    if (range === '1D') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
}

export default StockPriceChart;

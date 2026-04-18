import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Alert,
    Autocomplete,
    Box,
    Chip,
    Paper,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    useTheme,
} from '@mui/material';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { getAllStocks, getCandles, type CandleResolution } from '@api/stocksApi';
import { type StockListItem } from '@models/stockTypes';
import { type CandlesResponse } from '@models/portfolioTypes';

type RangeKey = '1D' | '1W' | '1M' | '1Y' | '5Y';

const rangeConfig: Record<RangeKey, { seconds: number; resolution: CandleResolution }> = {
    '1D': { seconds: 24 * 60 * 60, resolution: '15' },
    '1W': { seconds: 7 * 24 * 60 * 60, resolution: '60' },
    '1M': { seconds: 30 * 24 * 60 * 60, resolution: 'D' },
    '1Y': { seconds: 365 * 24 * 60 * 60, resolution: 'D' },
    '5Y': { seconds: 5 * 365 * 24 * 60 * 60, resolution: 'W' },
};

const SERIES_COLORS = ['#00b8d4', '#ff9100', '#00c853', '#ff1744', '#ab47bc', '#29b6f6'];

const ComparePage: React.FC = () => {
    const theme = useTheme();
    const [selected, setSelected] = useState<string[]>(['AAPL', 'MSFT']);
    const [range, setRange] = useState<RangeKey>('1M');

    const { data: stockOptions } = useQuery<StockListItem[]>({
        queryKey: ['stocks'],
        queryFn: getAllStocks,
    });

    const candleQuery = useQuery<CandlesResponse>({
        queryKey: ['candles', selected, range],
        queryFn: () => {
            const now = Math.floor(Date.now() / 1000);
            const cfg = rangeConfig[range];
            return getCandles(selected, cfg.resolution, now - cfg.seconds, now);
        },
        enabled: selected.length > 0,
        retry: false,
    });

    const chartData = useMemo(() => {
        if (!candleQuery.data) return [];

        const series = candleQuery.data.series;
        const normalized: Record<string, { t: number; p: number }[]> = {};
        for (const symbol of selected) {
            const s = series[symbol];
            if (!s || s.c.length === 0) continue;
            const base = s.c[0];
            if (base <= 0) continue;
            normalized[symbol] = s.t.map((t, i) => ({
                t,
                p: ((s.c[i] - base) / base) * 100,
            }));
        }

        const timestamps = new Set<number>();
        Object.values(normalized).forEach((arr) => arr.forEach((pt) => timestamps.add(pt.t)));
        const sortedTs = Array.from(timestamps).sort((a, b) => a - b);

        return sortedTs.map((t) => {
            const row: Record<string, number | string> = {
                date: new Date(t * 1000).toLocaleDateString(),
            };
            for (const symbol of selected) {
                const arr = normalized[symbol];
                if (!arr) continue;
                const match = arr.find((pt) => pt.t === t);
                if (match) row[symbol] = Number(match.p.toFixed(2));
            }
            return row;
        });
    }, [candleQuery.data, selected]);

    const showHistoricalUnavailable =
        candleQuery.isError &&
        (candleQuery.error as { response?: { status?: number } })?.response?.status === 503;

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Compare Stocks
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Values normalized to % change from the start of the selected range.
            </Typography>

            <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                    <Autocomplete
                        multiple
                        options={(stockOptions ?? []).map((s) => s.symbol)}
                        value={selected}
                        onChange={(_, value) => setSelected(value.slice(0, SERIES_COLORS.length))}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const { key, ...rest } = getTagProps({ index });
                                return <Chip key={key} label={option} {...rest} />;
                            })
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={`Symbols (max ${SERIES_COLORS.length})`}
                                placeholder="Add symbol"
                            />
                        )}
                        freeSolo
                    />

                    <ToggleButtonGroup
                        size="small"
                        value={range}
                        exclusive
                        onChange={(_, v: RangeKey | null) => v && setRange(v)}
                    >
                        {(Object.keys(rangeConfig) as RangeKey[]).map((r) => (
                            <ToggleButton key={r} value={r}>
                                {r}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    {selected.length === 0 && (
                        <Alert severity="info">Add at least one symbol to compare.</Alert>
                    )}

                    {showHistoricalUnavailable && (
                        <Alert severity="warning">
                            Historical market data is unavailable from the current data provider.
                        </Alert>
                    )}

                    {candleQuery.isError && !showHistoricalUnavailable && (
                        <Alert severity="error">Failed to load comparison data.</Alert>
                    )}

                    {candleQuery.isLoading && selected.length > 0 && (
                        <Typography color="text.secondary">Loading...</Typography>
                    )}

                    {chartData.length > 0 && (
                        <Box sx={{ width: '100%', height: 420 }}>
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <CartesianGrid
                                        stroke={theme.palette.divider}
                                        strokeDasharray="3 3"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        stroke={theme.palette.text.secondary}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke={theme.palette.text.secondary}
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(v) => `${v}%`}
                                        width={60}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                        }}
                                        formatter={(value) => `${Number(value).toFixed(2)}%`}
                                    />
                                    <Legend />
                                    {selected.map((symbol, idx) => (
                                        <Line
                                            key={symbol}
                                            type="monotone"
                                            dataKey={symbol}
                                            stroke={SERIES_COLORS[idx % SERIES_COLORS.length]}
                                            strokeWidth={2}
                                            dot={false}
                                            connectNulls
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
};

export default ComparePage;

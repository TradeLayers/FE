import { useMemo, useState } from 'react';
import { Box, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { type TransactionView } from '@models/portfolioTypes';
import { formatCurrency, formatQuantity } from './format';

type Interval = 'daily' | 'weekly' | 'monthly' | 'all';

type Props = {
    symbol: string;
    name: string;
    ownedQuantity: number;
    currentPrice: number;
    transactions: TransactionView[];
};

const intervalStart = (interval: Interval): Date | null => {
    const now = new Date();
    switch (interval) {
        case 'daily':
            return new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case 'weekly':
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'monthly':
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        default:
            return null;
    }
};

const StockStatsCard: React.FC<Props> = ({
    symbol,
    name,
    ownedQuantity,
    currentPrice,
    transactions,
}) => {
    const [interval, setInterval] = useState<Interval>('all');

    const stats = useMemo(() => {
        const symbolTxs = transactions.filter((t) => t.symbol === symbol);
        const allBuys = symbolTxs.filter((t) => t.transactionType === 'bought');

        const buyQty = allBuys.reduce((sum, t) => sum + t.quantity, 0);
        const buyCost = allBuys.reduce((sum, t) => sum + t.quantity * t.price, 0);
        const avgBuyPrice = buyQty > 0 ? buyCost / buyQty : 0;

        const currentValue = ownedQuantity * currentPrice;
        const costBasis = ownedQuantity * avgBuyPrice;
        const gainLoss = currentValue - costBasis;
        const gainPct = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

        const start = intervalStart(interval);
        const periodTxs = start
            ? symbolTxs.filter((t) => new Date(t.transactionDate) >= start)
            : symbolTxs;

        const periodBought = periodTxs
            .filter((t) => t.transactionType === 'bought')
            .reduce((sum, t) => sum + t.quantity, 0);
        const periodSold = periodTxs
            .filter((t) => t.transactionType === 'sold')
            .reduce((sum, t) => sum + t.quantity, 0);
        const periodTxCount = periodTxs.length;

        return {
            avgBuyPrice,
            currentValue,
            gainLoss,
            gainPct,
            periodBought,
            periodSold,
            periodTxCount,
        };
    }, [transactions, symbol, ownedQuantity, currentPrice, interval]);

    const gainColor =
        stats.gainLoss > 0 ? 'success.main' : stats.gainLoss < 0 ? 'error.main' : 'text.primary';

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                        {name}
                    </Typography>
                    <Typography variant="h6">{symbol}</Typography>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                        gap: 2,
                    }}
                >
                    <Stat label="Avg buy price" value={formatCurrency(stats.avgBuyPrice)} />
                    <Stat label="Current price" value={formatCurrency(currentPrice)} />
                    <Stat label="Total value" value={formatCurrency(stats.currentValue)} />
                    <Stat
                        label="Gain / loss"
                        value={`${formatCurrency(stats.gainLoss)} (${stats.gainPct.toFixed(2)}%)`}
                        color={gainColor}
                    />
                </Box>

                <Box>
                    <ToggleButtonGroup
                        size="small"
                        value={interval}
                        exclusive
                        onChange={(_, v: Interval | null) => v && setInterval(v)}
                    >
                        <ToggleButton value="daily">Daily</ToggleButton>
                        <ToggleButton value="weekly">Weekly</ToggleButton>
                        <ToggleButton value="monthly">Monthly</ToggleButton>
                        <ToggleButton value="all">All</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
                        gap: 2,
                    }}
                >
                    <Stat label="Transactions" value={String(stats.periodTxCount)} />
                    <Stat label="Bought (qty)" value={formatQuantity(stats.periodBought)} />
                    <Stat label="Sold (qty)" value={formatQuantity(stats.periodSold)} />
                </Box>
            </Stack>
        </Paper>
    );
};

const Stat: React.FC<{ label: string; value: string; color?: string }> = ({
    label,
    value,
    color,
}) => (
    <Box>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body1" sx={{ color }}>
            {value}
        </Typography>
    </Box>
);

export default StockStatsCard;

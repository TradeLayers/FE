import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { getAllStocks, getQuotes } from '@api/stocksApi';
import { isGuest } from '@models/userTypes';
import { type RootState } from '@store/store';
import {
    ChangeNegative,
    ChangePositive,
    Hero,
    MoversGrid,
    Panel,
    PanelTitle,
    Row,
    Rows,
    SymbolBlock,
} from './HomePage.styles';

type MoverRow = {
    symbol: string;
    name: string;
    price: number;
    percentChange: number;
};

type MoversPanelProps = {
    title: string;
    rows: MoverRow[];
    loading: boolean;
    emptyMessage: string;
    onRowClick: (symbol: string) => void;
};

const formatChange = (value: number): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
};

function MoversPanel({ title, rows, loading, emptyMessage, onRowClick }: MoversPanelProps): React.JSX.Element {
    return (
        <Paper variant="outlined" sx={Panel}>
            <Typography variant="h6" sx={PanelTitle}>
                {title}
            </Typography>
            <Box sx={Rows}>
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <Box key={index} sx={Row}>
                            <Box sx={SymbolBlock}>
                                <Skeleton variant="text" width={64} />
                                <Skeleton variant="text" width={120} />
                            </Box>
                            <Skeleton variant="text" width={90} />
                        </Box>
                    ))
                ) : rows.length > 0 ? (
                    rows.map((row) => (
                        <Box key={row.symbol} sx={Row} onClick={() => onRowClick(row.symbol)}>
                            <Box sx={SymbolBlock}>
                                <Typography variant="body1" fontWeight={700} noWrap>
                                    {row.symbol}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {row.name}
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body1" fontWeight={700} noWrap>
                                    ${row.price.toFixed(2)}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={row.percentChange >= 0 ? ChangePositive : ChangeNegative}
                                >
                                    {formatChange(row.percentChange)}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                )}
            </Box>
        </Paper>
    );
}

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const loggedIn = useSelector((state: RootState) => !isGuest(state.userSliceName));

    const { data: stocks, isLoading: stocksLoading } = useQuery({
        queryKey: ['home-default-stocks'],
        queryFn: getAllStocks,
        enabled: loggedIn,
    });

    const symbols = useMemo(() => (stocks ?? []).map((stock) => stock.symbol), [stocks]);

    const { data: quotes, isLoading: quotesLoading } = useQuery({
        queryKey: ['home-stock-quotes', symbols],
        queryFn: () => getQuotes(symbols),
        enabled: loggedIn && symbols.length > 0,
    });

    const movers = useMemo(() => {
        const stockMap = new Map((stocks ?? []).map((stock) => [stock.symbol, stock]));
        return (quotes ?? [])
            .map((quote) => {
                const stock = stockMap.get(quote.symbol);
                if (!stock) return null;

                return {
                    symbol: quote.symbol,
                    name: stock.name,
                    price: quote.price || stock.price,
                    percentChange: quote.percentChange,
                } satisfies MoverRow;
            })
            .filter((row): row is MoverRow => row !== null);
    }, [stocks, quotes]);

    const gainers = useMemo(
        () => movers.filter((row) => row.percentChange > 0).sort((a, b) => b.percentChange - a.percentChange).slice(0, 5),
        [movers],
    );

    const losers = useMemo(
        () => movers.filter((row) => row.percentChange < 0).sort((a, b) => a.percentChange - b.percentChange).slice(0, 5),
        [movers],
    );

    const handleRowClick = (symbol: string): void => {
        navigate(`/stocks?symbol=${encodeURIComponent(symbol)}`);
    };

    return (
        <Box>
            <Box sx={Hero}>
                <Typography variant="h5" component="h2" gutterBottom>
                Welcome to TradeLayers
                </Typography>
                <Typography variant="body1" color="text.secondary">
                Track market movements and stay connected to your portfolio in one place.
                </Typography>
            </Box>

            {loggedIn ? (
                <Box sx={MoversGrid}>
                    <MoversPanel
                        title="Top Gainers"
                        rows={gainers}
                        loading={stocksLoading || quotesLoading}
                        emptyMessage="No positive movers yet."
                        onRowClick={handleRowClick}
                    />
                    <MoversPanel
                        title="Top Losers"
                        rows={losers}
                        loading={stocksLoading || quotesLoading}
                        emptyMessage="No negative movers yet."
                        onRowClick={handleRowClick}
                    />
                </Box>
            ) : (
                <Paper variant="outlined" sx={{ p: 3 }}>
                    <Typography color="text.secondary">
                        Log in to view today&apos;s top gainers and losers.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default HomePage;

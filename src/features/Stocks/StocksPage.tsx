import { useState, useMemo, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, Divider } from '@mui/material';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useSearchParams } from 'react-router-dom';

import { authorizedApi } from '@api/axiosConfig';
import { addToWatchlist, getWatchlist, removeFromWatchlist } from '@api/watchlistApi';
import { getHoldings } from '@api/portfolioApi';
import { type StockListItem, type StockSearchResult, type StockProfile } from '@models/stockTypes';
import { type WatchlistItem } from '@models/watchlistTypes';
import { type HoldingView } from '@models/portfolioTypes';
import { isUser } from '@models/userTypes';
import { type RootState } from '@store/store';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus } from '@models/informationType';
import { formatCurrency, formatQuantity } from '../Account/format';
import TradeDialog from '../Account/TradeDialog';
import CreateAlertDialog from './CreateAlertDialog';
import StockPriceChart from './StockPriceChart';
import {
    PageContainer,
    LeftPanel,
    StockList,
    StockRow,
    StockRowSelected,
    RightPanel,
    ProfileHeader,
    ProfileHeaderInfo,
    ProfileHeaderActions,
    PriceBlock,
    MetricsGrid,
    MetricCard,
    OwnedBanner,
} from './StocksPage.styles';

const formatMarketCap = (marketCap: number): string => {
    if (!marketCap || marketCap <= 0) return '—';
    if (marketCap >= 1_000_000) return `$${(marketCap / 1_000_000).toFixed(2)}T`;
    if (marketCap >= 1_000) return `$${(marketCap / 1_000).toFixed(2)}B`;
    return `$${marketCap.toFixed(2)}M`;
};

const StocksPage: React.FC = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(
        searchParams.get('symbol'),
    );
    const [buyOpen, setBuyOpen] = useState(false);
    const [sellOpen, setSellOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);

    const user = useSelector((state: RootState) => state.userSliceName);
    const loggedIn = useSelector((state: RootState) => isUser(state.userSliceName));
    const debouncedSearch = useDebounce(search, 300);
    const symbolParam = searchParams.get('symbol');

    useEffect(() => {
        setSelectedSymbol(symbolParam);
    }, [symbolParam]);

    const { data: popularStocks } = useQuery<StockListItem[]>({
        queryKey: ['stocks'],
        queryFn: async () => {
            const res = await authorizedApi.get<StockListItem[]>('/stocks');
            return res.data;
        },
        enabled: loggedIn,
    });

    const { data: searchResults } = useQuery<StockSearchResult[]>({
        queryKey: ['stockSearch', debouncedSearch],
        queryFn: async () => {
            const res = await authorizedApi.get<StockSearchResult[]>(
                `/stocks/search?q=${debouncedSearch}`,
            );
            return res.data;
        },
        enabled: loggedIn && debouncedSearch.length > 0,
    });

    const { data: profile } = useQuery<StockProfile>({
        queryKey: ['stockProfile', selectedSymbol],
        queryFn: async () => {
            const res = await authorizedApi.get<StockProfile>(`/stocks/profile/${selectedSymbol}`);
            return res.data;
        },
        enabled: loggedIn && !!selectedSymbol,
    });

    const { data: watchlist } = useQuery<WatchlistItem[]>({
        queryKey: ['watchlist'],
        queryFn: getWatchlist,
        enabled: loggedIn,
    });

    const { data: holdings } = useQuery<HoldingView[]>({
        queryKey: ['holdings'],
        queryFn: getHoldings,
        enabled: loggedIn,
    });

    const watchedSymbols = useMemo(
        () => new Set((watchlist ?? []).map((w) => w.symbol)),
        [watchlist],
    );
    const isWatched = selectedSymbol ? watchedSymbols.has(selectedSymbol) : false;

    const ownedHolding = useMemo(
        () => (holdings ?? []).find((h) => h.symbol === selectedSymbol),
        [holdings, selectedSymbol],
    );
    const ownedQuantity = ownedHolding?.quantity ?? 0;

    const watchMutation = useMutation({
        mutationFn: async () => {
            if (!selectedSymbol) return;
            if (isWatched) {
                await removeFromWatchlist(selectedSymbol);
            } else {
                await addToWatchlist(selectedSymbol);
            }
        },
        onSuccess: () => {
            if (!selectedSymbol) return;
            dispatch(
                addInfo({
                    infoMessage: isWatched
                        ? `${selectedSymbol} removed from watchlist`
                        : `${selectedSymbol} added to watchlist`,
                    status: InfoMessageStatus.Success,
                }),
            );
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
    });

    const listItems = useMemo(() => {
        if (debouncedSearch && searchResults) {
            return searchResults.map((r) => ({ symbol: r.symbol, name: r.description, price: 0 }));
        }
        return popularStocks ?? [];
    }, [debouncedSearch, searchResults, popularStocks]);

    return (
        <Box sx={PageContainer}>
            <Box sx={LeftPanel}>
                <Box sx={{ p: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search stocks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Box>
                <Divider />
                <Box sx={StockList}>
                    {listItems.map((item) => (
                        <Box
                            key={item.symbol}
                            sx={selectedSymbol === item.symbol ? StockRowSelected : StockRow}
                            onClick={() => {
                                setSelectedSymbol(item.symbol);
                                setSearchParams({ symbol: item.symbol });
                            }}
                        >
                            <Box>
                                <Typography variant="body1" fontWeight={600}>
                                    {item.symbol}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.name}
                                </Typography>
                            </Box>
                            {item.price > 0 && (
                                <Typography variant="body1" color="success.main">
                                    ${item.price.toFixed(2)}
                                </Typography>
                            )}
                        </Box>
                    ))}
                    {listItems.length === 0 && (
                        <Typography sx={{ p: 2 }} color="text.secondary">
                            {search ? 'No results found' : 'Loading...'}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Box sx={RightPanel}>
                {profile ? (
                    <>
                        <Box sx={ProfileHeader}>
                            <Box sx={ProfileHeaderInfo}>
                                {profile.logo && (
                                    <img
                                        src={profile.logo}
                                        alt={profile.name}
                                        style={{ width: 56, height: 56, borderRadius: 8 }}
                                    />
                                )}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="h5" fontWeight={700} noWrap>
                                        {profile.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {profile.symbol} · {profile.exchange}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={PriceBlock}>
                                <Typography variant="caption" color="text.secondary">
                                    Current price
                                </Typography>
                                <Typography variant="h4" fontWeight={700} color="success.main">
                                    {profile.price > 0
                                        ? formatCurrency(profile.price)
                                        : 'Unavailable'}
                                </Typography>
                            </Box>
                            <Box sx={ProfileHeaderActions}>
                                <Button
                                    variant="contained"
                                    disabled={profile.price <= 0}
                                    onClick={() => setBuyOpen(true)}
                                >
                                    Buy
                                </Button>
                                {ownedQuantity > 0 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        disabled={profile.price <= 0}
                                        onClick={() => setSellOpen(true)}
                                    >
                                        Sell
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    startIcon={isWatched ? <StarIcon /> : <StarBorderIcon />}
                                    onClick={() => watchMutation.mutate()}
                                    disabled={watchMutation.isPending}
                                >
                                    {isWatched ? 'Watching' : 'Watch'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddAlertIcon />}
                                    onClick={() => setAlertOpen(true)}
                                >
                                    Alert
                                </Button>
                            </Box>
                        </Box>

                        {ownedQuantity > 0 && (
                            <Box sx={OwnedBanner}>
                                <Typography variant="body2">
                                    You own <strong>{formatQuantity(ownedQuantity)}</strong>{' '}
                                    {profile.symbol}
                                </Typography>
                                {profile.price > 0 && (
                                    <Typography variant="body2">
                                        Position value{' '}
                                        <strong>
                                            {formatCurrency(ownedQuantity * profile.price)}
                                        </strong>
                                    </Typography>
                                )}
                            </Box>
                        )}

                        <Box sx={MetricsGrid}>
                            <Box sx={MetricCard}>
                                <Typography variant="caption" color="text.secondary">
                                    Industry
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {profile.industry || '—'}
                                </Typography>
                            </Box>
                            <Box sx={MetricCard}>
                                <Typography variant="caption" color="text.secondary">
                                    Country
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {profile.country || '—'}
                                </Typography>
                            </Box>
                            <Box sx={MetricCard}>
                                <Typography variant="caption" color="text.secondary">
                                    Market Cap
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {formatMarketCap(profile.marketCap)}
                                </Typography>
                            </Box>
                            <Box sx={MetricCard}>
                                <Typography variant="caption" color="text.secondary">
                                    Exchange
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {profile.exchange || '—'}
                                </Typography>
                            </Box>
                        </Box>

                        <StockPriceChart symbol={profile.symbol} />
                    </>
                ) : (
                    <Typography color="text.secondary">Select a stock to view details</Typography>
                )}
            </Box>

            {profile && buyOpen && (
                <TradeDialog
                    open={buyOpen}
                    onClose={() => setBuyOpen(false)}
                    mode="buy"
                    symbol={profile.symbol}
                    name={profile.name}
                    currentPrice={profile.price}
                    availableBalance={
                        typeof user.balance === 'string' ? parseFloat(user.balance) : user.balance
                    }
                />
            )}

            {profile && sellOpen && ownedQuantity > 0 && (
                <TradeDialog
                    open={sellOpen}
                    onClose={() => setSellOpen(false)}
                    mode="sell"
                    symbol={profile.symbol}
                    name={profile.name}
                    currentPrice={profile.price}
                    ownedQuantity={ownedQuantity}
                />
            )}

            {profile && alertOpen && (
                <CreateAlertDialog
                    open={alertOpen}
                    onClose={() => setAlertOpen(false)}
                    symbol={profile.symbol}
                    name={profile.name}
                    currentPrice={profile.price}
                />
            )}
        </Box>
    );
};

function useDebounce(value: string, delay: number): string {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return (): void => {
            clearTimeout(id);
        };
    }, [value, delay]);

    return debounced;
}

export default StocksPage;

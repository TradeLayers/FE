import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, Divider } from '@mui/material';
import { authorizedApi } from '@api/axiosConfig';
import { type StockListItem, type StockSearchResult, type StockProfile } from '@models/stockTypes';
import { isUser } from '@models/userTypes';
import { type RootState } from '@store/store';
import {
    PageContainer,
    LeftPanel,
    StockList,
    StockRow,
    StockRowSelected,
    RightPanel,
    ProfileHeader,
    ProfileDetails,
    DetailRow,
} from './StocksPage.styles';

const StocksPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

    const loggedIn = useSelector((state: RootState) => isUser(state.userSliceName));
    const debouncedSearch = useDebounce(search, 300);

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
                            onClick={() => setSelectedSymbol(item.symbol)}
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
                            {profile.logo && (
                                <img
                                    src={profile.logo}
                                    alt={profile.name}
                                    style={{ width: 48, height: 48, borderRadius: 8 }}
                                />
                            )}
                            <Box>
                                <Typography variant="h5" fontWeight={700}>
                                    {profile.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {profile.symbol}
                                </Typography>
                            </Box>
                        </Box>
                        {profile.price > 0 && (
                            <Typography variant="h4" color="success.main" sx={{ mb: 3 }}>
                                ${profile.price.toFixed(2)}
                            </Typography>
                        )}
                        <Box sx={ProfileDetails}>
                            <Box sx={DetailRow}>
                                <Typography color="text.secondary">Industry</Typography>
                                <Typography>{profile.industry}</Typography>
                            </Box>
                            <Box sx={DetailRow}>
                                <Typography color="text.secondary">Exchange</Typography>
                                <Typography>{profile.exchange}</Typography>
                            </Box>
                            <Box sx={DetailRow}>
                                <Typography color="text.secondary">Country</Typography>
                                <Typography>{profile.country}</Typography>
                            </Box>
                            <Box sx={DetailRow}>
                                <Typography color="text.secondary">Market Cap</Typography>
                                <Typography>${(profile.marketCap / 1000).toFixed(1)}B</Typography>
                            </Box>
                        </Box>
                        <Button variant="contained" sx={{ mt: 4, px: 6, py: 1.5 }}>
                            Buy
                        </Button>
                    </>
                ) : (
                    <Typography color="text.secondary">Select a stock to view details</Typography>
                )}
            </Box>
        </Box>
    );
};

function useDebounce(value: string, delay: number): string {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}

export default StocksPage;

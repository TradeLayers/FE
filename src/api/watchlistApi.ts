import { authorizedApi } from './axiosConfig';
import { type WatchlistItem } from '@models/watchlistTypes';

export const getWatchlist = async (): Promise<WatchlistItem[]> => {
    const response = await authorizedApi.get<WatchlistItem[]>('/watchlist');
    return response.data;
};

export const addToWatchlist = async (symbol: string): Promise<WatchlistItem> => {
    const response = await authorizedApi.post<WatchlistItem>('/watchlist', { symbol });
    return response.data;
};

export const removeFromWatchlist = async (symbol: string): Promise<void> => {
    await authorizedApi.delete(`/watchlist/${encodeURIComponent(symbol)}`);
};

export const updateWatchlistThreshold = async (
    symbol: string,
    thresholdPrice: number,
): Promise<WatchlistItem> => {
    const response = await authorizedApi.patch<WatchlistItem>(
        `/watchlist/${encodeURIComponent(symbol)}/threshold`,
        { thresholdPrice },
    );
    return response.data;
};

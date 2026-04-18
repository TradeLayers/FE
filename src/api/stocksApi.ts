import { authorizedApi } from './axiosConfig';
import { type CandlesResponse } from '@models/portfolioTypes';
import { type StockListItem } from '@models/stockTypes';

export const getAllStocks = async (): Promise<StockListItem[]> => {
    const response = await authorizedApi.get<StockListItem[]>('/stocks');
    return response.data;
};

export type CandleResolution = 'D' | 'W' | 'M' | '60' | '30' | '15' | '5' | '1';

export const getCandles = async (
    symbols: string[],
    resolution: CandleResolution,
    fromUnix: number,
    toUnix: number,
): Promise<CandlesResponse> => {
    const response = await authorizedApi.get<CandlesResponse>('/stocks/candles', {
        params: {
            symbols: symbols.join(','),
            resolution,
            from: fromUnix,
            to: toUnix,
        },
    });
    return response.data;
};

import { authorizedApi } from './axiosConfig';
import {
    type HoldingView,
    type PortfolioHistoryResponse,
    type PortfolioInterval,
    type TradeRequest,
    type TradeResult,
    type TransactionView,
} from '@models/portfolioTypes';

export const getHoldings = async (): Promise<HoldingView[]> => {
    const response = await authorizedApi.get<HoldingView[]>('/portfolio/holdings');
    return response.data;
};

export type TransactionQuery = {
    stock?: string;
    from?: string;
    to?: string;
};

export const getTransactions = async (params: TransactionQuery = {}): Promise<TransactionView[]> => {
    const response = await authorizedApi.get<TransactionView[]>('/portfolio/transactions', {
        params,
    });
    return response.data;
};

export const getPortfolioHistory = async (
    interval: PortfolioInterval = 'all',
): Promise<PortfolioHistoryResponse> => {
    const response = await authorizedApi.get<PortfolioHistoryResponse>('/portfolio/history', {
        params: interval === 'all' ? {} : { interval },
    });
    return response.data;
};

export const buyStock = async (request: TradeRequest): Promise<TradeResult> => {
    const response = await authorizedApi.post<TradeResult>('/portfolio/buy', request);
    return response.data;
};

export const sellStock = async (request: TradeRequest): Promise<TradeResult> => {
    const response = await authorizedApi.post<TradeResult>('/portfolio/sell', request);
    return response.data;
};

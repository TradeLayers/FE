export type TransactionType = 'bought' | 'sold';

export type HoldingView = {
    stockId: string;
    symbol: string;
    name: string;
    quantity: number;
    currentPrice: number;
};

export type TransactionView = {
    id: string;
    symbol: string;
    name: string;
    price: number;
    quantity: number;
    transactionDate: string;
    transactionType: TransactionType;
};

export type TradeRequest = {
    symbol: string;
    quantity: number;
};

export type TradeResult = {
    transaction: TransactionView;
    balance: number;
};

export type PortfolioHistoryPoint = {
    date: string;
    investedCapital: number;
};

export type PortfolioHistoryResponse = {
    points: PortfolioHistoryPoint[];
    currentValue: number;
};

export type PortfolioInterval = 'daily' | 'weekly' | 'monthly' | 'all';

export type CandleSeries = {
    t: number[];
    c: number[];
    h: number[];
    l: number[];
    o: number[];
    v: number[];
};

export type CandlesResponse = {
    series: Record<string, CandleSeries>;
};

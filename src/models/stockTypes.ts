export type Stock = {
    stockName: string;
    symbol: string;
};

export type StockListItem = {
    symbol: string;
    name: string;
    price: number;
};

export type StockSearchResult = {
    symbol: string;
    description: string;
    type: string;
};

export type StockProfile = {
    symbol: string;
    name: string;
    logo: string;
    industry: string;
    country: string;
    exchange: string;
    marketCap: number;
    webUrl: string;
};

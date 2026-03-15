export type StockInfo = {
    price: number;
};

export type Stocks = {
    [stockName: string]: StockInfo;
}
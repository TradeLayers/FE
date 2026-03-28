import { type Stock } from './stockTypes';

enum TransactionTypes {
    Bought = 'BOUGHT',
    Sell = 'SELL',
}

export type StockTransaction = {
    stock: Stock;
    price: number;
    quantity: number;
    transactionDate: Date;
    transactionType: TransactionTypes;
};

export type UserStockTransactions = {
    stockTransactions: StockTransaction[];
};

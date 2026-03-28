import { type Stock } from "./stockTypes"

enum TransactionTypes {
    bought,
    sell
};

export type StockTransaction = {
    stock: Stock,
    price: number,
    quantity: number,
    transactionDate: Date,
    transactionType: TransactionTypes
}

export type UserStockTrasactions = {
    stocksTrasactions: StockTransaction[],
}
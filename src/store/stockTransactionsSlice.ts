import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserStockTransactions } from '@models/stockTransactions.Types';
import { type StockTransaction } from '@models/stockTransactions.Types';

const stockTrasactionsSliceName = 'stockTransactionsSlice';
const initialState: UserStockTransactions= {
    stockTransactions: [],
};

const stockTrasactionsSlice = createSlice({
    name: stockTrasactionsSliceName,
    initialState,
    reducers: {
        addStockTrasaction: (
            state: UserStockTransactions,
            action: PayloadAction<StockTransaction>,
        ) => {
            state.stockTransactions.push(action.payload);
        },
    },
});

export const { addStockTrasaction } = stockTrasactionsSlice.actions;
export default stockTrasactionsSlice.reducer;

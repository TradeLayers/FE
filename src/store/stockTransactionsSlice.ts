import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserStockTrasactions } from '@models/stockTransactions.Types';
import { type StockTransaction } from '@models/stockTransactions.Types';

const stockTrasactionsSliceName = 'stockSlice';
const initialState: UserStockTrasactions = {
    stocksTrasactions: [],
};

const stockTrasactionsSlice = createSlice({
    name: stockTrasactionsSliceName,
    initialState,
    reducers: {
        addStockTrasaction: (
            state: UserStockTrasactions,
            action: PayloadAction<StockTransaction>,
        ) => {
            state.stocksTrasactions.push(action.payload);
        },
    },
});

export const { addStockTrasaction } = stockTrasactionsSlice.actions;
export default stockTrasactionsSlice.reducer;

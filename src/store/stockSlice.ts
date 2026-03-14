import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type StockInfo, type Stocks } from '@models/stockTypes';

const stockSliceName = 'stockSlice';
const initialState: Stocks = {};

const stockSlice = createSlice({
    name: stockSliceName,
    initialState,
    reducers: {
        addStock: (state: Stocks, action: PayloadAction<[string, StockInfo]>) => {
            const [stockName, stockInfo] = action.payload;
            state[stockName] = stockInfo
        },
    },
});

export const { addStock } = stockSlice.actions;
export default stockSlice.reducer;
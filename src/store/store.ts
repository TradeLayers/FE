import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import userHoldings from './userHoldings';
import stockTransactions from './stockTransactionsSlice';

const store = configureStore({
    reducer: {
        userSliceName: userSlice,
        userHoldingsSliceName: userHoldings,
        stockTrasactionsSliceName: stockTransactions,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

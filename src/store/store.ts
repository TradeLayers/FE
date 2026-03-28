import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import userHoldingsSlice from './userHoldings';
import stockTransactionsSlice from './stockTransactionsSlice';
import informationSlice from './informationSplice';

const store = configureStore({
    reducer: {
        userSliceName: userSlice,
        userHoldingsSliceName: userHoldingsSlice,
        stockTrasactionsSliceName: stockTransactionsSlice,
        informationSliceName: informationSlice,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

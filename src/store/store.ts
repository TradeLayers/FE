import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import stockSlice from './stockSlice';
import informationSlice from './informationSplice';

const store = configureStore({
    reducer: {
        userSliceName: userSlice,
        stockSliceName: stockSlice,
        informationSliceName: informationSlice,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

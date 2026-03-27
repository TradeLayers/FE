import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import stockSlice from './stockSlice';
import errorSlice from './errorSlice'

const store = configureStore({
    reducer: {
        userSliceName: userSlice,
        stockSliceName: stockSlice,
        errorSliceName: errorSlice, 
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

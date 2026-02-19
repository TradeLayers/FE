import { configureStore } from "@reduxjs/toolkit";
import userSlice from './userSlice';

const store = configureStore({
    reducer:{
        userSliceName: userSlice,
    }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
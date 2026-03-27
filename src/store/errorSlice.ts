import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type BackendError } from '@models/errorTypes';

const errorSliceName = 'errorSlice';
const initialState: BackendError = {
    error: '',
};

const userSlice = createSlice({
    name: errorSliceName,
    initialState,
    reducers: {
        addError: (_, action: PayloadAction<BackendError>) => {
            return action.payload;
        },
        resetErrors: () => {
            return initialState;
        },
    },
});

export const { addError, resetErrors } = userSlice.actions;
export default userSlice.reducer;
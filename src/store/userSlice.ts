import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type User } from '@models/userTypes';

const userSliceName = 'userSlice';
const initialState: User = {
    name: 'Guest',
};

const userSlice = createSlice({
    name: userSliceName,
    initialState,
    reducers: {
        addUserInfo: (_, action: PayloadAction<User>) => {
            return action.payload;
        },
        resetUserInfo: () => {
            return initialState;
        },
    },
});

export const { addUserInfo, resetUserInfo } = userSlice.actions;
export default userSlice.reducer;

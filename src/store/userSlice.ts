import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type User, UserType } from '@models/userTypes';

const userSliceName = 'userSlice';
const initialState: User = {
    userType: UserType.Guest,
    name: 'Guest',
};

const userSlice = createSlice({
    name: userSliceName,
    initialState,
    reducers: {
        addUserInfo: (state: User, action: PayloadAction<User>) => {
            Object.assign(state, action.payload);            
            console.error(state);
        },
    },
});

export const { addUserInfo } = userSlice.actions;
export default userSlice.reducer;
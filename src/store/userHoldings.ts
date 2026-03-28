import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type AllUserHoldings, type UserHoldings } from '@models/userHoldingsTypes';

const userHoldingsSliceName = 'userHoldingsSlice';
const initialState: AllUserHoldings = {
    userHoldings: [],
};

const userHoldingsSlice = createSlice({
    name: userHoldingsSliceName,
    initialState,
    reducers: {
        addHoldings: (state: AllUserHoldings, action: PayloadAction<UserHoldings>) => {
            state.userHoldings.push(action.payload);
        },
    },
});

export const { addHoldings } = userHoldingsSlice.actions;
export default userHoldingsSlice.reducer;

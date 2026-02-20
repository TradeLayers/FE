import { createSlice } from '@reduxjs/toolkit';

//temporary
const userSliceName = 'tempName';
const initialState = {
    username: 'GUEST',
};

const userSlice = createSlice({
    name: userSliceName,
    initialState,
    reducers: {},
});

export default userSlice.reducer;

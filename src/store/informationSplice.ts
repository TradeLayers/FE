import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { InfoMessageStatus, type Information } from '@models/informationType';

const informationSliceName = 'infoSlice';
const initialState: Information = {
    infoMessage: '',
    status: InfoMessageStatus.None,
};

const infoSlice = createSlice({
    name: informationSliceName,
    initialState,
    reducers: {
        addInfo: (_, action: PayloadAction<Information>) => {
            return action.payload;
        },
        resetInfo: () => {
            return initialState;
        },
    },
});

export const { addInfo, resetInfo } = infoSlice.actions;
export default infoSlice.reducer;

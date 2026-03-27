import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { InfoMessageStatus, type Information} from '@models/informationType';

const informationSpliceName = 'infoSlice';
const initialState: Information = {
    infoMessage: '',
    status: InfoMessageStatus.None
};

const infoSlice = createSlice({
    name: informationSpliceName,
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

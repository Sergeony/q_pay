import {createSlice} from '@reduxjs/toolkit';


export interface BankProps {
    id: number;
    title: string;
    icon_url: string;
}

interface stateProps {
  banks: BankProps[];
  loading: boolean;
  error: string;
}

const initialState: stateProps = {
  banks: [],
  loading: false,
  error: '',
}

export const banksSlice = createSlice({
  name: 'advertisements',
  initialState,
  reducers: {
    setBanks: (state, action) => {
      state.banks = action.payload;
    }
  },
});


export const { setBanks } = banksSlice.actions;
export default banksSlice.reducer;

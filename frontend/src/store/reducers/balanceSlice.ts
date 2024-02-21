import {createSlice, PayloadAction} from '@reduxjs/toolkit';


export interface BalanceProps {
    activeBalance: number;
    frozenBalance: number;
}

interface stateProps {
  balance: BalanceProps;
  loading: boolean;
  error: string;
}

const initialState: stateProps = {
  balance: {activeBalance: 0, frozenBalance: 0},
  loading: false,
  error: '',
}

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<{active_balance: number, frozen_balance: number}>) => {
      state.balance.activeBalance = action.payload.active_balance;
      state.balance.frozenBalance = action.payload.frozen_balance;
    }
  },
});


export const { setBalance } = balanceSlice.actions;
export default balanceSlice.reducer;

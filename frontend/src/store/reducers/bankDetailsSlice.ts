import { createSlice } from '@reduxjs/toolkit';
import {BankProps} from "./banksSlice";

export interface BankDetailsProps {
  id: number;
  title: string;
  card_number: number;
  cardholder_name: string;
  bank: BankProps,
  daily_limit: number;
  weekly_limit: number;
  monthly_limit: number;
  current_daily_turnover: number;
  current_weekly_turnover: number;
  current_monthly_turnover: number;
  use_automation: boolean;
  is_active: boolean;
}


interface BankDetailsState {
  bankDetails: BankDetailsProps[];
  loading: boolean;
  error: string;
}

const initialState: BankDetailsState = {
  bankDetails: [],
  loading: false,
  error: '',
};

export const bankDetailsSlice = createSlice({
  name: 'bankDetails',
  initialState,
  reducers: {
    setBankDetails: (state, action) => {
      state.bankDetails = action.payload;
    },
  },
});

export const { setBankDetails } = bankDetailsSlice.actions;
export default bankDetailsSlice.reducer;

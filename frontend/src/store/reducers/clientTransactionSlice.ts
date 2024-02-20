import {createSlice} from '@reduxjs/toolkit';
import {TransactionStatus,  TransactionType} from "../../service/transactionsService";

import {BankProps} from "./banksSlice";


export interface ClientTransactionProps {
  id: string;
  order_id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  actual_amount: number;
  amount_to_deposit: number;
  currency: number;
  created_at: string;
  completed_at: string | null;
  finished_at: string | null;
  lifetime: string;
  card_number: string;
  client_card_number?: string;
  client_bank: BankProps;
  client_id: string;
  use_automation: boolean;
  receipt_url?: string;
}

interface stateProps {
  transaction: ClientTransactionProps | null;
  loading: boolean;
  error: string;
}

const initialState: stateProps = {
  transaction: null,
  loading: false,
  error: '',
}

export const clientTransactionSlice = createSlice({
  name: 'clientTransaction',
  initialState,
  reducers: {
    setTransaction: (state, action) => {
      state.transaction = action.payload;
    }
  },
});


export const { setTransaction } = clientTransactionSlice.actions;
export default clientTransactionSlice.reducer;

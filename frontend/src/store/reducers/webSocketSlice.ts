import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {RequisitesProps} from "./requisitesSlice";


export interface TransactionProps {
  id: string;
  status: number;
  trader: number;
  merchant: number;
  created_at: string;
  confirmed_at: string | null;
  finished_at: string | null;
  requisites: RequisitesProps;
  trader_usdt_rate: string;
  exchange_usdt_rate: string;
  automation_used: boolean;
  claimed_amount?: string;
  actual_amount?: string;
  amount?: string;
}


interface WebSocketState {
  inputTransactions: TransactionProps[];
  outputTransactions: TransactionProps[];
}

const initialState: WebSocketState = {
  inputTransactions: [],
  outputTransactions: [],
};


const webSocketSlice = createSlice({
  name: 'webSocket',
  initialState,
  reducers: {
    addTransaction(state, action: PayloadAction<{transactionData: TransactionProps, transactionType: string}>) {
      if (action.payload.transactionType == 'input')
        state.inputTransactions.push(action.payload.transactionData);
      else if (action.payload.transactionType == 'output')
        state.outputTransactions.push(action.payload.transactionData)
    },
    loadTransactions(state, action: PayloadAction<{transactions: TransactionProps[], transactionType: string}>) {
      if (action.payload.transactionType == 'input')
        state.inputTransactions = action.payload.transactions;
      else if (action.payload.transactionType == 'output')
        state.outputTransactions = action.payload.transactions;
    },
    moveTransaction(state, action: PayloadAction<{id: string, transactionType: string}>) {
      if (action.payload.transactionType == 'input')
        state.inputTransactions = state.inputTransactions.filter((t) => t.id !== action.payload.id);
      else if (action.payload.transactionType == 'output')
        state.outputTransactions = state.outputTransactions.filter((t) => t.id !== action.payload.id);

    },
    updateTransactionStatus(state, action: PayloadAction<{ id: string; status: number, transactionType: string }>) {
      let transaction = null;
      if (action.payload.transactionType == 'input')
        transaction = state.inputTransactions.find(t => t.id === action.payload.id);
      else if (action.payload.transactionType == 'output')
        transaction = state.outputTransactions.find(t => t.id === action.payload.id);

      if (transaction) {
        transaction.status = action.payload.status;
      }
    },
  },
});

export const {
  addTransaction,
  loadTransactions,
  moveTransaction,
  updateTransactionStatus
} = webSocketSlice.actions;

export default webSocketSlice.reducer;

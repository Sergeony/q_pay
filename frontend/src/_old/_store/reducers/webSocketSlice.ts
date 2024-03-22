import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {TransactionProps, TransactionStatus} from "_service/transactionsService";


interface WebSocketState {
  transactions: TransactionProps[];
}

const initialState: WebSocketState = {
  transactions: [],
};


export const webSocketSlice = createSlice({
  name: 'webSocket',
  initialState,
  reducers: {
    loadTransactions(state, action: PayloadAction<TransactionProps[]>) {
      state.transactions = action.payload;
    },
    updateTransaction(state, action: PayloadAction<TransactionProps>) {
      state.transactions = state.transactions.filter(t => t.id !== action.payload.id);
      if ([TransactionStatus.PENDING, TransactionStatus.REVIEWING].includes(action.payload.status))
        state.transactions.push(action.payload);
    },
    addTransactions(state, action: PayloadAction<TransactionProps[]>) {
      state.transactions.push(...action.payload);
    },
  },
});

export const {
  loadTransactions,
  updateTransaction,
  addTransactions,
} = webSocketSlice.actions;

export default webSocketSlice.reducer;

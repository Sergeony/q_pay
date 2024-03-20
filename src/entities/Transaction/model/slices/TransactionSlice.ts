import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTransactionStatusGroup } from "../../model/consts/consts";
import { Transaction, TransactionSchema } from "../types/Transaction";

const initialState: TransactionSchema = {
    items: []
};

export const TransactionSlice = createSlice({
    name: "Transaction",
    initialState,
    reducers: {
        setActiveTransactions: (state, action: PayloadAction<Transaction[]>) => {
            state.items = action.payload;
        },
        updateActiveTransactions: (state, action: PayloadAction<Transaction>) => {
            const transaction = action.payload;

            const transactionExisted = state.items.map((t) => t.id).includes(transaction.id);
            const isActive = getTransactionStatusGroup(transaction.status) === "active";
            if (transactionExisted && !isActive) {
                state.items = state.items.filter((t) => t.id !== transaction.id);
                // TODO: add some notification about transaction update
            } else if (!transactionExisted) {
                state.items.push(transaction);
            } else if (transactionExisted && isActive) {
                // TODO: add some notification when transaction becomes able to review
            } else {
                console.log("UNKNOWN TRANSACTION UPDATE: ", transaction);
            }
        },
    },
});

export const { actions: transactionActions } = TransactionSlice;
export const { reducer: transactionReducer } = TransactionSlice;

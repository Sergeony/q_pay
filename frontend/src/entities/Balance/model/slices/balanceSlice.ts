import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Balance, BalanceSchema } from "../types/BalanceSchema";

const initialState: BalanceSchema = {};

export const BalanceSlice = createSlice({
    name: "balance",
    initialState,
    reducers: {
        setBalance: (state, action: PayloadAction<Balance>) => {
            state.data = action.payload;
        },
    },
});

export const { actions: balanceActions } = BalanceSlice;
export const { reducer: balanceReducer } = BalanceSlice;

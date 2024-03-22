import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BankSchema } from "../types/BankSchema";

const initialState: BankSchema[] = [];

export const BankSlice = createSlice({
    name: "bank",
    initialState,
    reducers: {
        setBanks: (state, action: PayloadAction<BankSchema[]>) => {
            state.push(...action.payload);
        },
    },
});

export const { actions: bankActions } = BankSlice;
export const { reducer: bankReducer } = BankSlice;

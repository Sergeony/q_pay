import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BankDetails, BankDetailsSchema } from "../types/BankDetailsSchema";

const initialState: BankDetailsSchema = {
    items: []
};

export const BankSlice = createSlice({
    name: "bankDetails",
    initialState,
    reducers: {
        setBankDetails: (state, action: PayloadAction<BankDetails[]>) => {
            state.items = action.payload;
        },
    },
});

export const { actions: bankDetailsActions } = BankSlice;
export const { reducer: bankDetailsReducer } = BankSlice;

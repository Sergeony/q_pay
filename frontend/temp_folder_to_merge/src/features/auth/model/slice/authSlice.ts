import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthSchema } from "../types/authSchema";

const initialState: AuthSchema = {};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setTotpSecret(state, action: PayloadAction<string>) {
            state.totpSecret = action.payload;
        },
        setTt(state, action: PayloadAction<string>) {
            state.tt = action.payload;
        },
    },
});

export const { actions: authActions } = authSlice;
export const { reducer: authReducer } = authSlice;

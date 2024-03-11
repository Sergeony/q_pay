import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";
import { AuthSchema } from "../types/authSchema";

const initialState: AuthSchema = {
    email: "",
    totpBase32: "",
    tt: "",
};

interface DecodedTokenProps {
    userType: number;
    id: number;
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setTotpBase32: (state, action: PayloadAction<string>) => {
            state.totpBase32 = action.payload;
        },
        setTT: (state, action: PayloadAction<string>) => {
            state.tt = action.payload;
        },
        signOut: (state) => {
            state.email = "";
            state.totpBase32 = "";
            localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        }
    },
});

export const { actions: authActions } = authSlice;
export const { reducer: authReducer } = authSlice;

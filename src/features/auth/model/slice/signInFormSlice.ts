import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SignInFormSchema } from "../types/signInFormSchema";

const initialState: SignInFormSchema = {
    email: "",
    password: "",
};

const signInFormSlice = createSlice({
    name: "signInForm",
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
    },
});

export const { actions: signInFormActions } = signInFormSlice;
export const { reducer: signInFormReducer } = signInFormSlice;

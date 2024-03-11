import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserSchema } from "../types/userSchema";

const initialState: UserSchema = {};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            delete state.user;
        },
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;

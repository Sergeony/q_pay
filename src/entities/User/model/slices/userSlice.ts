import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSchema, User } from "../types/userSchema";

const initialState: UserSchema = {};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.data = action.payload;
        },
        clearUser: (state) => {
            delete state.data;
        },
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSchema, UserData, UserPrefs } from "../types/userSchema";

const initialState: UserSchema = {};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserData>) => {
            state.data = action.payload;
        },
        setUserPrefs: (state, action: PayloadAction<UserPrefs>) => {
            state.prefs = action.payload;
        },
        clearUser: (state) => {
            delete state.data;
            delete state.prefs;
        },
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;

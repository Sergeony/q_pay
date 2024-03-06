import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSchema } from "../types/userSchema";
import { User } from "../types/user";

const initialState: UserSchema = {};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<User>) => {
            state.authData = action.payload;
        },
        initAuthData: (state) => {
            // const user = localStorage.getItem(USER_LOCALSTORAGE_KEY);
            // if (user) {
            //     state.authData = JSON.parse(user);
            // }
            // state._initialized = true;
        },
        // logout: (state) => {
        //     state.authData = undefined;
        //     localStorage.removeItem(USER_LOCALSTORAGE_KEY);
        //     state._initialized = false;
        // },
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;

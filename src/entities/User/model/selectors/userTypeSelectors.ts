import { createSelector } from "@reduxjs/toolkit";
import { StateSchema } from "app/providers/StoreProvider";
import { UserType } from "../types/userSchema";

export const getUserType = (state: StateSchema) => state.user.data?.type;

export const isUserTrader = createSelector(getUserType, (type) => type === UserType.TRADER);
export const isUserMerchant = createSelector(getUserType, (type) => type === UserType.MERCHANT);
export const isUserAdmin = createSelector(getUserType, (type) => type === UserType.ADMIN);

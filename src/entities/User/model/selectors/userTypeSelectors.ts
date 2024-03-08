import { createSelector } from "@reduxjs/toolkit";
import { StateSchema } from "app/providers/StoreProvider";
import { UserType } from "../types/user";

const getUserType = (state: StateSchema) => state.user.authData?.type;

export const isUserTrader = createSelector(getUserType, (type) => type === UserType.TRADER);
export const isUserMerchant = createSelector(getUserType, (type) => type === UserType.MERCHANT);
export const isUserAdmin = createSelector(getUserType, (type) => type === UserType.ADMIN);

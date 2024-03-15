import { createSelector } from "@reduxjs/toolkit";
import { getUserData } from "./getUserData";
import { UserType } from "../types/userSchema";

export const isTrader = createSelector(getUserData, (data) => data?.type === UserType.TRADER);
export const isMerchant = createSelector(getUserData, (data) => data?.type === UserType.MERCHANT);
export const isAdmin = createSelector(getUserData, (data) => data?.type === UserType.ADMIN);

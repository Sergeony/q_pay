import { createSelector } from "@reduxjs/toolkit";
import { StateSchema } from "app/providers/StoreProvider";
import { TransactionType } from "../consts/consts";

export const getActiveTransactions = (state: StateSchema) => state.activeTransactions?.items;

export const getDepositTransactions = createSelector(
    getActiveTransactions,
    (data) => data?.filter((t) => t.type === TransactionType.IN)
);

export const getWithdrawalTransactions = createSelector(
    getActiveTransactions,
    (data) => data?.filter((t) => t.type === TransactionType.OUT)
);

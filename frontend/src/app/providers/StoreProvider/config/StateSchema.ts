import {
    Action, EnhancedStore, Reducer, ReducersMapObject,
} from "@reduxjs/toolkit";
import { UserSchema } from "entities/User";
import { AuthSchema } from "features/auth";
import { api } from "shared/api/api";
import { BankSchema } from "entities/Bank";
import { BankDetailsSchema } from "entities/BankDetails";
import { TransactionSchema } from "entities/Transaction";
import { BalanceSchema } from "entities/Balance";

export interface StateSchema {
    user: UserSchema;
    [api.reducerPath]: ReturnType<typeof api.reducer>;

    // Async reducers
    auth?: AuthSchema;
    banks?: BankSchema[];
    bankDetails?: BankDetailsSchema;
    activeTransactions?: TransactionSchema;
    balance?: BalanceSchema;
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>;
    reduce: (state: StateSchema, action: Action) => StateSchema;
    add: (key: StateSchemaKey, reducer: Reducer) => void;
    remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
    reducerManager: ReducerManager;
}

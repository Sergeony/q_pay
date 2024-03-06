import {
    Action, EnhancedStore, Reducer, ReducersMapObject,
} from "@reduxjs/toolkit";
import { UserSchema } from "entities/User";
import { SignInFormSchema } from "features/auth";

export interface StateSchema {
    user: UserSchema,

    // Async reducers
    signInForm?: SignInFormSchema,
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

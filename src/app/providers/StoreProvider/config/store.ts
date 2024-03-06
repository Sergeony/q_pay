import { ReducersMapObject, configureStore } from "@reduxjs/toolkit";
import { StateSchema } from "app/providers/StoreProvider/config/StateSchema";
import { userReducer } from "entities/User";
import { signInFormReducer } from "features/auth";

export function createReactStore(initialState?: StateSchema) {
    const rootReducers: ReducersMapObject<StateSchema> = {
        user: userReducer,
        sigInForm: signInFormReducer,
    };

    return configureStore<StateSchema>({
        reducer: rootReducers,
        devTools: __IS_DEV__,
        preloadedState: initialState,
    });
}

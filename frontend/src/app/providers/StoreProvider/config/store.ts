import { configureStore, Reducer, ReducersMapObject } from "@reduxjs/toolkit";
import { userReducer } from "entities/User";
import { api } from "shared/api/api";
import { StateSchema } from "./StateSchema";
import { createReducerManager } from "./reducerManager";

export function createReduxStore(
    initialState?: StateSchema,
    asyncReducers?: ReducersMapObject<StateSchema>,
) {
    const rootReducers: ReducersMapObject<StateSchema> = {
        ...asyncReducers,
        user: userReducer,
        [api.reducerPath]: api.reducer,
    };

    const reducerManager = createReducerManager(rootReducers);

    const store = configureStore({
        reducer: reducerManager.reduce as Reducer<StateSchema>,
        devTools: __IS_DEV__,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) => (
            getDefaultMiddleware()
                .concat(api.middleware)
        ),
    });

    // @ts-ignore
    store.reducerManager = reducerManager;

    return store;
}

export type AppDispatch = ReturnType<typeof createReduxStore>["dispatch"];

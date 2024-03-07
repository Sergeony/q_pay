import { ReactNode, useEffect } from "react";
import { useStore } from "react-redux";
import { Reducer } from "@reduxjs/toolkit";
import { ReduxStoreWithManager, StateSchemaKey } from "app/providers/StoreProvider";

export type Reducers = {
    [key in StateSchemaKey]?: Reducer;
}

interface DynamicModuleLoaderProps {
    reducers: Reducers;
    keepAfterUnmount?: boolean;
    children: ReactNode;
}

export const DynamicReducersLoader = (props: DynamicModuleLoaderProps) => {
    const {
        reducers,
        keepAfterUnmount = false,
        children
    } = props;
    const store = useStore() as ReduxStoreWithManager;

    useEffect(() => {
        Object.entries(reducers).forEach(([key, reducer]) => {
            store.reducerManager.add(key as StateSchemaKey, reducer);
        });

        return () => {
            if (!keepAfterUnmount) {
                Object.entries(reducers).forEach(([key, _]) => {
                    store.reducerManager.remove(key as StateSchemaKey);
                });
            }
        };
        // eslint-disable-next-line
    }, []);

    return children;
};

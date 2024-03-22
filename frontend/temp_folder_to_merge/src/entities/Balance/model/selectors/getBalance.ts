import { StateSchema } from "app/providers/StoreProvider";

export const getBalance = (state: StateSchema) => state.balance?.data;

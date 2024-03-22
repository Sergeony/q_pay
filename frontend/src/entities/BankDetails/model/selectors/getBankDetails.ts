import { StateSchema } from "app/providers/StoreProvider";

export const getBankDetails = (state: StateSchema) => state.bankDetails?.items;

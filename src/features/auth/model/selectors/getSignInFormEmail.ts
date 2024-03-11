import { StateSchema } from "app/providers/StoreProvider";

export const getAuthEmail = (state: StateSchema) => state?.auth?.email || "";

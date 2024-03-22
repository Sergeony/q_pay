import { StateSchema } from "app/providers/StoreProvider";

export const getAuthTt = (state: StateSchema) => state?.auth?.tt || "";

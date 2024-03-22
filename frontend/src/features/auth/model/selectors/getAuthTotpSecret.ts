import { StateSchema } from "app/providers/StoreProvider";

export const getAuthTotpSecret = (state: StateSchema) => state?.auth?.totpSecret || "";

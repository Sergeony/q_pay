import { StateSchema } from "app/providers/StoreProvider";

export const getTotpBase32 = (state: StateSchema) => state?.auth?.totpBase32 || "";

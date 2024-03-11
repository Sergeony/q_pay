import { StateSchema } from "app/providers/StoreProvider";

export const getTT = (state: StateSchema) => state?.auth?.tt || "";

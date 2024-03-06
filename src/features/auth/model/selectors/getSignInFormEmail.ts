import { StateSchema } from "app/providers/StoreProvider";

export const getSignInFormEmail = (state: StateSchema) => state?.signInForm?.email || "";

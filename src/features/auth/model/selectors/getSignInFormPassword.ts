import { StateSchema } from "app/providers/StoreProvider";

export const getSignInFormPassword = (state: StateSchema) => state?.signInForm?.password || "";

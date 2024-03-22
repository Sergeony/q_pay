import { StateSchema } from "app/providers/StoreProvider";

export const getUserPrefs = (state: StateSchema) => state.user.prefs;

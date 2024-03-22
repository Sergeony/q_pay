export {
    isTrader,
    isAdmin,
    isMerchant,

} from "./model/selectors/userTypeSelectors";
export { getUserData } from "entities/User/model/selectors/getUserData";
export { getUserPrefs } from "entities/User/model/selectors/getUserPrefs";
export {
    UserType,
    UserSchema,
    UserData
} from "./model/types/userSchema";
export {
    userReducer,
    userActions
} from "./model/slices/userSlice";
export {
    useLazyGetUserPrefsQuery,
} from "./api/userService";

import { TransactionStatusGroup, TransactionTypeRepr } from "entities/Transaction";

export enum AppRoutes {
    REGISTER = "register",
    VERIFY_EMAIL = "verify_email",
    SETUP_TOTP = "setup_totp",
    LOGIN = "login",
    VERIFY_TOTP = "verify_totp",

    TRADER_ADS = "trader_ads",

    PAY = "pay",

    ADMIN_USERS = "admin_users",
    ADMIN_USER_DETAILS = "admin_user_details",

    SETTINGS = "settings",
    // BALANCE = "balance",

    FORBIDDEN = "forbidden",
    NOT_FOUND = "not_found",
}

export const getRouteRegister = () => "/register";
export const getRouteVerifyEmail = () => "/verify-email";
export const getRouteSetupTotp = () => "/setup-totp";
export const getRouteLogin = () => "/login";
export const getRouteVerifyTotp = () => "/verify-totp";

export const getRouteAds = () => "/ads";
export const getRouteBankDetails = () => "bank-details";

export type PayPageTab = TransactionStatusGroup | "export";
export const getRoutePay = (
    type: TransactionTypeRepr | ":type",
    payTab: PayPageTab | ":payTab",
) => `/pay/${type}/${payTab}`;

export const getRoutePayForAdmin = (type: TransactionTypeRepr | ":type") => `pay/${type}`;
export type AdminUsersTab = "traders" | "merchants";
export const getRouteAdminUsers = (tab: AdminUsersTab | ":tab") => `/${tab}`;
export const getRouteAdminUserDetails = (
    tab: AdminUsersTab | ":tab",
    userId: string | ":userId",
) => `/${tab}/${userId}`;

export const getRouteSettings = () => "/settings";
export const getRouteSettingsIntegration = () => "integration";
// export const getRouteBalance = () => "/balance";

export const getRouteForbidden = () => "/forbidden";
export const getRouteNotFound = () => "*";

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRouteRegister()]: AppRoutes.REGISTER,
    [getRouteVerifyEmail()]: AppRoutes.VERIFY_EMAIL,
    [getRouteVerifyTotp()]: AppRoutes.VERIFY_TOTP,
    [getRouteLogin()]: AppRoutes.LOGIN,
    [getRouteSetupTotp()]: AppRoutes.SETUP_TOTP,

    // [getRouteTraderPayIn()]: AppRoutes.TRADER_PAY_IN,
    // [getRouteTraderPayOut()]: AppRoutes.TRADER_PAY_OUT,
    //
    // [getRouteMerchantPayIn()]: AppRoutes.MERCHANT_PAY_IN,
    // [getRouteMerchantPayOut()]: AppRoutes.MERCHANT_PAY_IN,
    //
    // [getRouteAdminTraders()]: AppRoutes.ADMIN_TRADERS,
    // [getRouteAdminTraderDetails(":id")]: AppRoutes.ADMIN_TRADER_DETAILS,
    // [getRouteAdminMerchants()]: AppRoutes.ADMIN_MERCHANTS,
    // [getRouteAdminMerchantDetails(":id")]: AppRoutes.ADMIN_MERCHANT_DETAILS,
    //
    // [getRouteSettings()]: AppRoutes.SETTINGS,
    // [getRouteBalance()]: AppRoutes.BALANCE,

    [getRouteForbidden()]: AppRoutes.FORBIDDEN,
    [getRouteNotFound()]: AppRoutes.NOT_FOUND,
};

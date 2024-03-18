export enum AppRoutes {
    REGISTER = "register",
    VERIFY_EMAIL = "verify_email",
    VERIFY_TOTP = "verify_totp",
    LOGIN = "login",
    SETUP_TOTP = "setup_totp",

    TRADER_ADS = "trader_ads",
    // TRADER_PAY_IN = "trader_pay_in",
    // TRADER_PAY_OUT = "trader_pay_out",
    //
    // MERCHANT_PAY_IN = "merchant_pay_in",
    // MERCHANT_PAY_OUT = "merchant_pay_out",
    //
    // ADMIN_TRADERS = "admin_traders",
    // ADMIN_TRADER_DETAILS = "admin_traders", // + :id
    // ADMIN_MERCHANTS = "admin_merchants",
    // ADMIN_MERCHANT_DETAILS = "admin_merchants", // + :id
    //
    // SETTINGS = "settings",
    // BALANCE = "balance",

    FORBIDDEN = "forbidden",
    NOT_FOUND = "*",
}

export const getRouteRegister = () => "/register";
export const getRouteVerifyEmail = () => "/verify-email";
export const getRouteVerifyTotp = () => "/verify-totp";
export const getRouteLogin = () => "/login";
export const getRouteSetupTotp = () => "/setup-totp";

export const getRouteTraderAds = () => "/ads";
export const getRouteTraderBankDetails = () => "/bank-details";
// export const getRouteTraderPayIn = () => "/trader/pay-in";
// export const getRouteTraderPayOut = () => "/trader/pay-out";
//
// export const getRouteMerchantPayIn = () => "/merchant/pay-in";
// export const getRouteMerchantPayOut = () => "/merchant/pay-out";
//
// export const getRouteAdminTraders = () => "/admin/traders";
// export const getRouteAdminTraderDetails = (id: string) => `/admin/traders/${id}`;
// export const getRouteAdminMerchants = () => "/admin/merchants";
// export const getRouteAdminMerchantDetails = (id: string) => `/admin/merchants/${id}`;
//
// export const getRouteSettings = () => "/settings";
// export const getRouteBalance = () => "/balance";

export const getRouteForbidden = () => "/forbidden";
export const getRouteNotFound = () => "/not-found";

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

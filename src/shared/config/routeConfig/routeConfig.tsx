import { RouteProps } from "react-router-dom";

// import ClientBuyPage from "pages/ClientPage";
//
// import RegistrationPage from "pages/SignUpPage";
// import LoginPage from "pages/SinInPage";
//
// import AdvertisementsPage from "pages/TraderAdsPage";
// import BuyPage from "pages/TraderPayOutPage";
// import SellPage from "pages/TraderPayInPage";
//
// import DepositPage from "pages/MerchantPayInPage";
// import WithdrawalPage from "pages/MerchantPayOutPage";
//
// import TradersPage from "pages/AdminTradersPage";
// import MerchantsPage from "pages/AdminMerchantsPage";
// import TraderStatsPage from "pages/AdminTraderStatsPage";
// import MerchantStatsPage from "pages/AdminMerchantStatsPage";
//
// import MerchantBalancePage from "pages/BalancePage";
// import MerchantSettingsPage from "pages/SettingsPage";

import { NotFoundPage } from "pages/NotFoundPage";
import { ForbiddenPage } from "pages/ForbiddenPage";

import { UserType } from "entities/User";
import { VerifyEvcForm } from "features/auth/ui/VerifyEvcForm";
import { VerifyTotpForm } from "features/auth/ui/VerifyTotpForm";
import { lazy } from "react";
import { SignUpForm } from "features/auth/ui/SignUpForm";
import { SignInForm } from "features/auth/ui/SignInForm";
import { TotpSecretForm } from "features/auth/ui/TotpSecretForm";

// @ts-ignore
// const SignUpForm = lazy(() => import("features/auth/ui/SignUpForm.tsx"));
// @ts-ignore
// const SignInForm = lazy(() => import("features/auth/ui/SignInForm.tsx"));

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
    userType?: UserType;
}

export enum AppRoutes {
    // CLIENT = "client",
    //
    SIGN_UP = "sign_up",
    VERIFY_EVC = "verify_evc",
    VERIFY_TOTP = "verify_totp",
    SIGN_IN = "sign_in",
    TOTP_SECRET = "totp_secret",
    //
    // TRADER_ADS = "trader_ads",
    // TRADER_PAY_IN = "trader_pay_in",
    // TRADER_PAY_OUT = "trader_pay_out",
    //
    // MERCHANT_PAY_IN = "merchant_pay_in",
    // MERCHANT_PAY_OUT = "merchant_pay_out",
    //
    // ADMIN_TRADERS = "admin_traders",
    // ADMIN_TRADER_DETAILS = "admin_trader_details",
    // ADMIN_MERCHANTS = "admin_merchants",
    // ADMIN_MERCHANT_DETAILS = "admin_merchant_details",
    //
    // SETTINGS = "settings",
    // BALANCE = "balance",

    FORBIDDEN = "forbidden",
    NOT_FOUND = "not_found",
}

export const RoutePath: Record<AppRoutes, string> = {
    // [AppRoutes.CLIENT]: "/client/",
    //
    [AppRoutes.SIGN_UP]: "/sign-up/",
    [AppRoutes.VERIFY_EVC]: "/verify-evc/",
    [AppRoutes.VERIFY_TOTP]: "/verify-totp/",
    [AppRoutes.SIGN_IN]: "/sign-in/",
    [AppRoutes.TOTP_SECRET]: "/totp-secret",
    //
    // [AppRoutes.TRADER_ADS]: "/ads/",
    // [AppRoutes.TRADER_PAY_IN]: "/trader/in/",
    // [AppRoutes.TRADER_PAY_OUT]: "/trader/out/",
    // [AppRoutes.MERCHANT_PAY_IN]: "/merchant/in/",
    // [AppRoutes.MERCHANT_PAY_OUT]: "/merchant/out/",
    // [AppRoutes.ADMIN_TRADERS]: "/admin/traders/",
    // [AppRoutes.ADMIN_TRADER_DETAILS]: "admin/traders/", // + :id
    // [AppRoutes.ADMIN_MERCHANTS]: "/admin/merchants/",
    // [AppRoutes.ADMIN_MERCHANT_DETAILS]: "/admin/merchants/", // + :id
    //
    // [AppRoutes.SETTINGS]: "/settings/",
    // [AppRoutes.BALANCE]: "/balance/",

    [AppRoutes.FORBIDDEN]: "/forbidden/",
    [AppRoutes.NOT_FOUND]: "*",
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    // [AppRoutes.CLIENT]: {
    //     path: RoutePath.client,
    //     element: <ClientBuyPage />,
    // },
    //
    [AppRoutes.SIGN_UP]: {
        path: RoutePath.sign_up,
        element: <SignUpForm />,
    },
    [AppRoutes.VERIFY_EVC]: {
        path: RoutePath.verify_evc,
        element: <VerifyEvcForm />,
    },
    [AppRoutes.VERIFY_TOTP]: {
        path: RoutePath.verify_totp,
        element: <VerifyTotpForm />,
    },
    [AppRoutes.SIGN_IN]: {
        path: RoutePath.sign_in,
        element: <SignInForm />,
    },
    [AppRoutes.TOTP_SECRET]: {
        path: RoutePath.totp_secret,
        element: <TotpSecretForm />,
    },
    //
    // [AppRoutes.TRADER_ADS]: {
    //     path: RoutePath.trader_ads,
    //     element: <AdvertisementsPage />,
    //     authOnly: true,
    //     userType: UserType.TRADER,
    // },
    // [AppRoutes.TRADER_PAY_IN]: {
    //     path: RoutePath.trader_pay_in,
    //     element: <BuyPage />,
    //     authOnly: true,
    //     userType: UserType.TRADER,
    // },
    // [AppRoutes.TRADER_PAY_OUT]: {
    //     path: RoutePath.trader_pay_out,
    //     element: <SellPage />,
    //     authOnly: true,
    //     userType: UserType.TRADER,
    // },
    //
    // [AppRoutes.MERCHANT_PAY_IN]: {
    //     path: RoutePath.merchant_pay_in,
    //     element: <DepositPage />,
    //     authOnly: true,
    //     userType: UserType.MERCHANT,
    // },
    // [AppRoutes.MERCHANT_PAY_OUT]: {
    //     path: RoutePath.merchant_pay_out,
    //     element: <WithdrawalPage />,
    //     authOnly: true,
    //     userType: UserType.MERCHANT,
    // },
    //
    // [AppRoutes.ADMIN_TRADERS]: {
    //     path: RoutePath.admin_traders,
    //     element: <TradersPage />,
    //     authOnly: true,
    //     userType: UserType.ADMIN,
    // },
    // [AppRoutes.ADMIN_TRADER_DETAILS]: {
    //     path: `${RoutePath.admin_traders}:id/`,
    //     element: <TraderStatsPage />,
    //     authOnly: true,
    //     userType: UserType.ADMIN,
    // },
    // [AppRoutes.ADMIN_MERCHANTS]: {
    //     path: `${RoutePath.admin_merchants}`,
    //     element: <MerchantsPage />,
    //     authOnly: true,
    //     userType: UserType.ADMIN,
    // },
    // [AppRoutes.ADMIN_MERCHANT_DETAILS]: {
    //     path: `${RoutePath.admin_merchants}:id/`,
    //     element: <MerchantStatsPage />,
    //     authOnly: true,
    //     userType: UserType.ADMIN,
    // },
    //
    // [AppRoutes.SETTINGS]: {
    //     path: RoutePath.settings,
    //     element: <MerchantSettingsPage />,
    //     authOnly: true,
    // },
    // [AppRoutes.BALANCE]: {
    //     path: RoutePath.balance,
    //     element: <MerchantBalancePage />,
    //     authOnly: true,
    // },

    [AppRoutes.FORBIDDEN]: {
        path: RoutePath.forbidden,
        element: <ForbiddenPage />,
    },
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: <NotFoundPage />,
    },
};

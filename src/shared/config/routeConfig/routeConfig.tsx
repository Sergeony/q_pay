import { RouteProps } from "react-router-dom";

import ClientBuyPage from "pages/ClientPage";

import RegistrationPage from "pages/SignUpPage";
import LoginPage from "pages/SinInPage";

import AdvertisementsPage from "pages/TraderAdsPage";
import BuyPage from "pages/TraderPayOutPage";
import SellPage from "pages/TraderPayInPage";

import DepositPage from "pages/MerchantPayInPage";
import WithdrawalPage from "pages/MerchantPayOutPage";

import TradersPage from "pages/AdminTradersPage";
import MerchantsPage from "pages/AdminMerchantsPage";
import TraderStatsPage from "pages/AdminTraderStatsPage";
import MerchantStatsPage from "pages/AdminMerchantStatsPage";

import MerchantBalancePage from "pages/BalancePage";
import MerchantSettingsPage from "pages/SettingsPage";

import NotFoundPage from "pages/NotFoundPage";
import { UserType } from "entities/User";

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
    userType?: UserType;
}

export enum AppRoutes {
    CLIENT = "client",

    SIGN_UP = "sign_up",
    SIGN_IN = "sign_in",

    TRADER_ADS = "trader_ads",
    TRADER_PAY_IN = "trader_pay_in",
    TRADER_PAY_OUT = "trader_pay_out",

    MERCHANT_PAY_IN = "merchant_pay_in",
    MERCHANT_PAY_OUT = "merchant_pay_out",

    ADMIN_TRADERS = "admin_traders",
    ADMIN_MERCHANTS = "admin_merchants",

    SETTINGS = "settings",
    BALANCE = "balance",

    // last
    NOT_FOUND = "not_found",
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.CLIENT]: "/client/",

    [AppRoutes.SIGN_UP]: "/sign-up/",
    [AppRoutes.SIGN_IN]: "/sign-in/",

    [AppRoutes.TRADER_ADS]: "/ads/",
    [AppRoutes.TRADER_PAY_IN]: "/trader/in/",
    [AppRoutes.TRADER_PAY_OUT]: "/trader/out/",
    [AppRoutes.MERCHANT_PAY_IN]: "/merchant/in/",
    [AppRoutes.MERCHANT_PAY_OUT]: "/merchant/out/",
    [AppRoutes.ADMIN_TRADERS]: "/admin/traders/", // + :id
    [AppRoutes.ADMIN_MERCHANTS]: "/admin/merchants/", // + :id

    [AppRoutes.SETTINGS]: "/settings/",
    [AppRoutes.BALANCE]: "/balance/",

    // last
    [AppRoutes.NOT_FOUND]: "*",
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.CLIENT]: {
        path: RoutePath.client,
        element: <ClientBuyPage />,
    },

    [AppRoutes.SIGN_UP]: {
        path: RoutePath.sign_up,
        element: <RegistrationPage />,
    },
    [AppRoutes.SIGN_IN]: {
        path: RoutePath.sign_in,
        element: <LoginPage />,
    },

    [AppRoutes.TRADER_ADS]: {
        path: RoutePath.trader_ads,
        element: <AdvertisementsPage />,
        authOnly: true,
        userType: UserType.TRADER,
    },
    [AppRoutes.TRADER_PAY_IN]: {
        path: RoutePath.trader_pay_in,
        element: <BuyPage />,
        authOnly: true,
        userType: UserType.TRADER,
    },
    [AppRoutes.TRADER_PAY_OUT]: {
        path: RoutePath.trader_pay_out,
        element: <SellPage />,
        authOnly: true,
        userType: UserType.TRADER,
    },

    [AppRoutes.MERCHANT_PAY_IN]: {
        path: RoutePath.merchant_pay_in,
        element: <DepositPage />,
        authOnly: true,
        userType: UserType.MERCHANT,
    },
    [AppRoutes.MERCHANT_PAY_OUT]: {
        path: RoutePath.merchant_pay_out,
        element: <WithdrawalPage />,
        authOnly: true,
        userType: UserType.MERCHANT,
    },

    [AppRoutes.ADMIN_TRADERS]: {
        path: RoutePath.admin_traders,
        element: <TradersPage />,
        authOnly: true,
        userType: UserType.ADMIN,
    },
    [AppRoutes.ADMIN_TRADERS]: {
        path: `${RoutePath.admin_traders}:id/`,
        element: <TraderStatsPage />,
        authOnly: true,
        userType: UserType.ADMIN,
    },
    [AppRoutes.ADMIN_MERCHANTS]: {
        path: `${RoutePath.admin_merchants}`,
        element: <MerchantsPage />,
        authOnly: true,
        userType: UserType.ADMIN,
    },
    [AppRoutes.ADMIN_MERCHANTS]: {
        path: `${RoutePath.admin_merchants}:id/`,
        element: <MerchantStatsPage />,
        authOnly: true,
        userType: UserType.ADMIN,
    },

    [AppRoutes.SETTINGS]: {
        path: RoutePath.settings,
        element: <MerchantSettingsPage />,
        authOnly: true,
    },
    [AppRoutes.BALANCE]: {
        path: RoutePath.balance,
        element: <MerchantBalancePage />,
        authOnly: true,
    },

    // last
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: <NotFoundPage />,
    },
};

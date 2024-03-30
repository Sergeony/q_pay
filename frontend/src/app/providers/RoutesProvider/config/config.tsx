import {
    AppRoutes,
    getRouteAdsAndBankDetails,
    getRouteBankDetails,
    getRouteForbidden,
    getRouteLogin,
    getRouteNotFound,
    getRoutePay,
    getRouteRegister,
    getRouteSettings,
    getRouteSettingsIntegration,
    getRouteSetupTotp,
    getRouteVerifyEmail,
    getRouteVerifyTotp,
} from "shared/const/router";
import { NotFoundPage } from "pages/NotFoundPage";
import { ForbiddenPage } from "pages/ForbiddenPage";
import { AppRoutesProps } from "shared/config/routeConfig/routeConfig";
import {
    SetupTotpForm, SignInForm, SignUpForm, VerifyEmailForm, VerifyTotpForm,
} from "features/auth";
import { TraderAdsPage } from "pages/TraderAdsPage";
import { PayPage } from "pages/PayPage";
import { SettingsPage, TabGeneral, TabIntegration } from "pages/SettingsPage";
import { UserType } from "entities/User";
import { Route } from "react-router-dom";
import { AdsTab } from "features/AdsTab";
import { BankDetailsTab } from "features/BankDetailsTab";

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.REGISTER]: {
        path: getRouteRegister(),
        element: <SignUpForm />,
        publicOnly: true,
    },
    [AppRoutes.VERIFY_EMAIL]: {
        path: getRouteVerifyEmail(),
        element: <VerifyEmailForm />,
        publicOnly: true,
    },
    [AppRoutes.VERIFY_TOTP]: {
        path: getRouteVerifyTotp(),
        element: <VerifyTotpForm />,
        publicOnly: true,
    },
    [AppRoutes.LOGIN]: {
        path: getRouteLogin(),
        element: <SignInForm />,
        publicOnly: true,
    },
    [AppRoutes.SETUP_TOTP]: {
        path: getRouteSetupTotp(),
        element: <SetupTotpForm />,
        publicOnly: true,
    },

    [AppRoutes.TRADER_ADS]: {
        path: getRouteAdsAndBankDetails(),
        element: <TraderAdsPage />,
        roles: [UserType.TRADER],
        childRoutes: [
            <Route
                index
                element={<AdsTab />}
            />,
            <Route
                path={getRouteBankDetails()}
                element={<BankDetailsTab />}
            />,
            <Route
                path={getRouteNotFound()}
                element={<NotFoundPage />}
            />,
        ],
    },
    [AppRoutes.PAY]: {
        path: getRoutePay(":type", ":tab"),
        element: <PayPage />,
        roles: [UserType.TRADER, UserType.MERCHANT],
    },
    [AppRoutes.SETTINGS]: {
        path: getRouteSettings(),
        element: <SettingsPage />,
        roles: [UserType.TRADER, UserType.MERCHANT, UserType.ADMIN],
        childRoutes: [
            <Route
                index
                element={<TabGeneral />}
            />,
            <Route
                path={getRouteSettingsIntegration()}
                element={<TabIntegration />}
            />,
            <Route
                path={getRouteNotFound()}
                element={<NotFoundPage />}
            />,
        ],
    },

    [AppRoutes.FORBIDDEN]: {
        path: getRouteForbidden(),
        element: <ForbiddenPage />,
    },
    [AppRoutes.NOT_FOUND]: {
        path: getRouteNotFound(),
        element: <NotFoundPage />,
    },

    // [AppRoutes.CLIENT]: {
    //     path: RoutePath.client,
    //     element: <ClientBuyPage />,
    // },
    // [AppRoutes.TRADER_PAY_OUT]: {
    //     path: getRouteTraderPayOut(),
    //     element: <SellPage />,
    //     authOnly: true,
    //     userType: UserType.TRADER,
    // },
    // [AppRoutes.MERCHANT_PAY_IN]: {
    //     path: getRouteMerchantPayIn(),
    //     element: <DepositPage />,
    //     authOnly: true,
    //     userType: UserType.MERCHANT,
    // },
    // [AppRoutes.MERCHANT_PAY_OUT]: {
    //     path: getRouteMerchantPayOut(),
    //     element: <WithdrawalPage />,
    //     authOnly: true,
    //     userType: UserType.MERCHANT,
    // },
    // [AppRoutes.ADMIN_TRADERS]: {
    //     path: getRouteAdminTraders(),
    //     element: <TradersPage />,
    //     authOnly: true,
    //     userType: UserType.ADMIN,
    // },
    // [AppRoutes.ADMIN_TRADER_DETAILS]: {
    //     path: getRouteAdminTraderDetails(":id"),
    //     element: <TraderStatsPage />,
    //     authOnly: true,
    //     userType: UserType.ADMIN,
    // },
    // [AppRoutes.ADMIN_MERCHANTS]: {
    //     path: getRouteAdminMerchants(),
    //     element: <MerchantsPage />,
    //     authOnly: true,
    //     userType: UserType.ADMIN,
    // },
    // [AppRoutes.ADMIN_MERCHANT_DETAILS]: {
    //     path: getRouteAdminMerchantDetails(":id"),
    //     element: <MerchantStatsPage />,
    //     authOnly: true,
    //     userType: UserType.ADMIN,
    // },
    // [AppRoutes.BALANCE]: {
    //     path: getRouteBalance(),
    //     element: <MerchantBalancePage />,
    //     authOnly: true,
    // },

};

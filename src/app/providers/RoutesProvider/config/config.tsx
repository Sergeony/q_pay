import {
    AppRoutes,
    getRouteVerifyEmail,
    getRouteVerifyTotp,
    getRouteSetupTotp,
    getRouteForbidden,
    getRouteNotFound,
    getRouteRegister,
    getRouteLogin,
    getRouteTraderAds,
    getRouteTraderBankDetails,
    // getRouteAdminMerchantDetails,
    // getRouteAdminMerchants,
    // getRouteAdminTraderDetails,
    // getRouteAdminTraders,
    // getRouteBalance,
    // getRouteLogin,
    // getRouteMerchantPayIn,
    // getRouteMerchantPayOut,
    // getRouteSettings,
    // getRouteTraderAds,
    // getRouteTraderPayIn,
    // getRouteTraderPayOut,

} from "shared/const/router";
import { NotFoundPage } from "pages/NotFoundPage";
import { ForbiddenPage } from "pages/ForbiddenPage";
import { AppRoutesProps } from "shared/config/routeConfig/routeConfig";
import {
    SignUpForm,
    VerifyTotpForm,
    SignInForm,
    SetupTotpForm,
    VerifyEmailForm,
} from "features/auth";
import { TraderAdsPage } from "pages/TraderAdsPage";

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.TRADER_ADS]: {
        path: "/*",
        element: <TraderAdsPage />,
    },
    [AppRoutes.REGISTER]: {
        path: getRouteRegister(),
        element: <SignUpForm />,
    },
    [AppRoutes.VERIFY_EMAIL]: {
        path: getRouteVerifyEmail(),
        element: <VerifyEmailForm />,
    },
    [AppRoutes.VERIFY_TOTP]: {
        path: getRouteVerifyTotp(),
        element: <VerifyTotpForm />,
    },
    [AppRoutes.LOGIN]: {
        path: getRouteLogin(),
        element: <SignInForm />,
    },
    [AppRoutes.SETUP_TOTP]: {
        path: getRouteSetupTotp(),
        element: <SetupTotpForm />,
    },

    // [AppRoutes.CLIENT]: {
    //     path: RoutePath.client,
    //     element: <ClientBuyPage />,
    // },
    // [AppRoutes.TRADER_PAY_IN]: {
    //     path: getRouteTraderPayIn(),
    //     element: <BuyPage />,
    //     authOnly: true,
    //     userType: UserType.TRADER,
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
    // [AppRoutes.SETTINGS]: {
    //     path: getRouteSettings(),
    //     element: <MerchantSettingsPage />,
    //     authOnly: true,
    // },
    // [AppRoutes.BALANCE]: {
    //     path: getRouteBalance(),
    //     element: <MerchantBalancePage />,
    //     authOnly: true,
    // },

    [AppRoutes.FORBIDDEN]: {
        path: getRouteForbidden(),
        element: <ForbiddenPage />,
    },
    [AppRoutes.NOT_FOUND]: {
        path: getRouteNotFound(),
        element: <NotFoundPage />,
    },
};

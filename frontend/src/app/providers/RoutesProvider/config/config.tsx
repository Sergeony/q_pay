import {
    AppRoutes,
    getRouteAdminUserDetails,
    getRouteAdminUsers,
    getRouteAds, getRouteBalance,
    getRouteBankDetails,
    getRouteForbidden,
    getRouteLogin,
    getRouteNotFound,
    getRoutePay, getRoutePayForAdmin,
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
import { AdminUsersPage } from "pages/AdminUsersPage/ui/AdminUsersPage";
import { AdminUserDetailsPage } from "pages/AdminUsersPage/ui/AdminUserDetailsPage";
import { TransactionsTab } from "features/TransactionsTab";
import { BalancePage } from "pages/BalancePage";

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
    [AppRoutes.SETUP_TOTP]: {
        path: getRouteSetupTotp(),
        element: <SetupTotpForm />,
        publicOnly: true,
    },
    [AppRoutes.LOGIN]: {
        path: getRouteLogin(),
        element: <SignInForm />,
        publicOnly: true,
    },
    [AppRoutes.VERIFY_TOTP]: {
        path: getRouteVerifyTotp(),
        element: <VerifyTotpForm />,
        publicOnly: true,
    },

    [AppRoutes.TRADER_ADS]: {
        path: getRouteAds(),
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
        path: getRoutePay(":type", ":payTab"),
        element: <PayPage />,
        roles: [UserType.TRADER, UserType.MERCHANT],
    },

    [AppRoutes.ADMIN_USERS]: {
        path: getRouteAdminUsers(":tab"),
        element: <AdminUsersPage />,
        roles: [UserType.ADMIN],
    },
    [AppRoutes.ADMIN_USER_DETAILS]: {
        path: getRouteAdminUserDetails(":tab", ":userId"),
        element: <AdminUserDetailsPage />,
        roles: [UserType.ADMIN],
        childRoutes: [
            <Route
                path={getRoutePayForAdmin(":type")}
                element={<TransactionsTab />}
            />,
            <Route
                path={getRouteAds().slice(1)}
                element={<AdsTab />}
            />,
            <Route
                path={getRouteBankDetails()}
                element={<BankDetailsTab />}
            />,
        ]
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
    [AppRoutes.BALANCE]: {
        path: getRouteBalance(),
        element: <BalancePage />,
        roles: [UserType.TRADER, UserType.MERCHANT, UserType.ADMIN],
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
};

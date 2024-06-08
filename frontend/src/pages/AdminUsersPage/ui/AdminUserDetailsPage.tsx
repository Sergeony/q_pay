import { Outlet, useParams } from "react-router-dom";
import {
    AdminUsersTab, getRouteAds, getRouteBankDetails, getRoutePay, getRoutePayForAdmin
} from "shared/const/router";
import { NotFoundPage } from "pages/NotFoundPage";
import { useTranslation } from "react-i18next";
import { AppNavLink } from "shared/ui/AppNavLink/AppNavLink";
import { TransactionStatusGroup } from "entities/Transaction";

export const AdminUserDetailsPage = () => {
    const { t } = useTranslation();
    const { tab } = useParams<{tab: AdminUsersTab}>();

    if (!tab || !["traders", "merchants"].includes(tab)) {
        return <NotFoundPage />;
    }

    return (
        <main className="v-stack gap-32 w-full max-w-98-75 px-2rem alignCenter">
            <nav className="w-full">
                {
                    tab === "traders" ? (
                        <ul className="h-stack gap-32">
                            <li>
                                <AppNavLink
                                    to={getRoutePayForAdmin("in")}
                                    title={t("pay_in_page_title")}
                                    variant="tab"
                                >
                                    {t("pay_in_page_title")}
                                </AppNavLink>
                            </li>
                            <li>
                                <AppNavLink
                                    to={getRoutePayForAdmin("out")}
                                    title={t("pay_out_page_title")}
                                    variant="tab"
                                >
                                    {t("pay_out_page_title")}
                                </AppNavLink>
                            </li>
                            <li>
                                <AppNavLink
                                    to={getRouteAds().slice(1)}
                                    title={t("ads_tab_title")}
                                    variant="tab"
                                >
                                    {t("ads_tab_title")}
                                </AppNavLink>
                            </li>
                            <li>
                                <AppNavLink
                                    to={getRouteBankDetails()}
                                    title={t("bank_details_tab_title")}
                                    variant="tab"
                                >
                                    {t("bank_details_tab_title")}
                                </AppNavLink>
                            </li>
                        </ul>
                    ) : (
                        <ul className="h-stack gap-32">
                            <li>
                                <AppNavLink
                                    to={getRoutePayForAdmin("in")}
                                    title={t("pay_in_page_title")}
                                    variant="tab"
                                >
                                    {t("pay_in_page_title")}
                                </AppNavLink>
                            </li>
                            <li>
                                <AppNavLink
                                    to={getRoutePayForAdmin("out")}
                                    title={t("pay_out_page_title")}
                                    variant="tab"
                                >
                                    {t("pay_out_page_title")}
                                </AppNavLink>
                            </li>
                        </ul>
                    )
                }
            </nav>
            <Outlet />
        </main>
    );
};

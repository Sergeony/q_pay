import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { transactionReducer, } from "entities/Transaction";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import { classNames } from "shared/lib/classNames/classNames";
import { bankDetailsReducer } from "entities/BankDetails";
import { getRouteSettingsIntegration } from "shared/const/router";
import { AppNavLink } from "shared/ui/AppNavLink/AppNavLink";

const reducers: Reducers = {
    activeTransactions: transactionReducer,
    bankDetails: bankDetailsReducer,
};

const SettingsPage = () => {
    const { t } = useTranslation();

    return (
        <DynamicReducersLoader keepAfterUnmount reducers={reducers}>
            <main className={classNames("", ["w-full max-w-xl px-2rem v-stack gap-32"])}>
                <h2 className="h1">{t("settings_page_title")}</h2>
                <nav className="h-stack gap-32">
                    <AppNavLink
                        end
                        to=""
                        variant="tab"
                        title={t("settings_general_tab_title")}
                    >
                        {t("settings_general_tab_title")}
                    </AppNavLink>
                    <AppNavLink
                        end
                        to={getRouteSettingsIntegration()}
                        variant="tab"
                        title={t("settings_integration_tab_title")}
                    >
                        {t("settings_integration_tab_title")}
                    </AppNavLink>
                </nav>
                <Outlet />
            </main>
        </DynamicReducersLoader>
    );
};

export default SettingsPage;

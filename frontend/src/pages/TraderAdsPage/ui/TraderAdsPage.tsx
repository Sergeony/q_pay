import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AddButton } from "shared/ui/AddButton/AddButton";
import { useTranslation } from "react-i18next";
import {
    getRouteAds, getRouteBankDetails,
} from "shared/const/router";
import { CreateBankDetailsModal } from "features/BankDetailsTab";
import { CreateAdModal } from "features/AdsTab";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import { bankReducer } from "entities/Bank";
import { AppNavLink } from "shared/ui/AppNavLink/AppNavLink";
import cls from "./TraderAdsPage.module.scss";

const reducers: Reducers = {
    banks: bankReducer,
};

const TraderAdsPage = () => {
    const { t } = useTranslation();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const location = useLocation();

    return (
        <DynamicReducersLoader reducers={reducers} keepAfterUnmount>
            <main className={cls.main}>
                <div className="h-stack justifyBetween">
                    <nav className="h-stack gap-24">
                        <AppNavLink
                            end
                            to=""
                            variant="page"
                            title={t("ads_tab_title")}
                        >
                            {t("ads_tab_title")}
                        </AppNavLink>
                        <AppNavLink
                            end
                            to={getRouteBankDetails()}
                            variant="page"
                            title={t("bank_details_tab_title")}
                        >
                            {t("bank_details_tab_title")}
                        </AppNavLink>
                    </nav>
                    <AddButton
                        onClick={() => {
                            setModalIsOpen(true);
                        }}
                    />
                </div>
                <Outlet />
                {modalIsOpen && location.pathname.endsWith(getRouteAds()) && (
                    <CreateAdModal
                        onClose={() => setModalIsOpen(false)}
                    />
                )}
                {modalIsOpen && location.pathname.endsWith(getRouteBankDetails()) && (
                    <CreateBankDetailsModal
                        onClose={() => setModalIsOpen(false)}
                    />
                )}
            </main>
        </DynamicReducersLoader>
    );
};

export default TraderAdsPage;

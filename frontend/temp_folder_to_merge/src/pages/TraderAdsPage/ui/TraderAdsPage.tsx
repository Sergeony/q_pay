import { Suspense, useState } from "react";
import {
    NavLink,
    Route, Routes, useLocation
} from "react-router-dom";
import { AddButton } from "shared/ui/AddButton/AddButton";
import { useTranslation } from "react-i18next";
import { getRouteTraderAds, getRouteTraderBankDetails } from "shared/const/router";
import { BankDetailsTab, CreateBankDetailsModal } from "features/BankDetailsTab";
import { AdsTab, CreateAdModal } from "features/AdsTab";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import { bankReducer } from "entities/Bank";
import cls from "./TraderAdsPage.module.scss";

const reducers: Reducers = {
    banks: bankReducer,
};

const TraderAdsPage = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <DynamicReducersLoader reducers={reducers} keepAfterUnmount>
            <main className={cls.main}>
                <div className="h-stack justifyBetween">
                    <nav className="h-stack gap-24">
                        <NavLink
                            to={getRouteTraderAds()}
                            className={({ isActive }) => `${cls.TabLink} ${isActive && cls.active}`}
                        >
                            {t("ads_tab_title")}
                        </NavLink>
                        <NavLink
                            to={getRouteTraderBankDetails()}
                            className={({ isActive }) => `${cls.TabLink} ${isActive && cls.active}`}
                        >
                            {t("bank_details_tab_title")}
                        </NavLink>
                    </nav>
                    <AddButton
                        onClick={() => {
                            setModalIsOpen(true);
                        }}
                    />
                </div>
                <Routes>
                    <Route
                        element={<Suspense><BankDetailsTab /></Suspense>}
                        path={getRouteTraderBankDetails()}
                    />
                    <Route
                        element={<Suspense><AdsTab /></Suspense>}
                        path={getRouteTraderAds()}
                    />
                </Routes>
                {modalIsOpen && location.pathname.endsWith(getRouteTraderAds()) && (
                    <CreateAdModal
                        onClose={() => setModalIsOpen(false)}
                    />
                )}
                {modalIsOpen && location.pathname.endsWith(getRouteTraderBankDetails()) && (
                    <CreateBankDetailsModal
                        onClose={() => setModalIsOpen(false)}
                    />
                )}
            </main>
        </DynamicReducersLoader>
    );
};

export default TraderAdsPage;
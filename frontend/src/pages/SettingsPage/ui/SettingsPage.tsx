import {
    NavLink, useParams
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    transactionReducer,
} from "entities/Transaction";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import { classNames } from "shared/lib/classNames/classNames";
import { bankDetailsReducer } from "entities/BankDetails";
import { useSelector } from "react-redux";
import { getUserData, UserType } from "entities/User";
import { getRouteSettings, SettingsPageTab } from "shared/const/router";
import { TabGeneral } from "./TabGeneral";
import { TabIntegration } from "./TabIntegration";

const reducers: Reducers = {
    activeTransactions: transactionReducer,
    bankDetails: bankDetailsReducer,
};

const SettingsPage = () => {
    const { t } = useTranslation();
    const { tab } = useParams<{ tab: SettingsPageTab }>();
    const userData = useSelector(getUserData);

    if (!userData?.type) return null;

    return (
        <DynamicReducersLoader keepAfterUnmount reducers={reducers}>
            <main className={classNames("", ["w-full max-w-xl mx-20r v-stack gap-32"])}>
                <h2 className="h1">{t("settings_page_title")}</h2>
                {userData.type === UserType.MERCHANT && (
                    <nav>
                        <NavLink to={getRouteSettings()} />
                        <NavLink to={getRouteSettings(tab)} />
                    </nav>
                )}
                {!tab ? <TabGeneral userData={userData} /> : <TabIntegration />}
            </main>
        </DynamicReducersLoader>
    );
};

export default SettingsPage;

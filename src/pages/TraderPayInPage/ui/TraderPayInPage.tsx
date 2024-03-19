import { Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "shared/ui/Link/Link";
import { getRouteTraderPayIn } from "shared/const/router";
import { TransactionsTab } from "features/TraderTransactionsTab";
import {
    TransactionStatusGroup,
    TransactionType,
    transactionReducer,
} from "entities/Transaction";
import { useMemo } from "react";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import cls from "./TraderPayInPage.module.scss";

const reducers: Reducers = {
    activeTransactions: transactionReducer,
};

const TraderPayInPage = () => {
    const location = useLocation();
    const isExportPage = location.pathname.includes("/export");
    const { t } = useTranslation();

    const transactionType = useMemo(() => (location.pathname.endsWith("in")
        ? TransactionType.DEPOSIT
        : TransactionType.WITHDRAWAL), [location.pathname]);

    return (
        <DynamicReducersLoader reducers={reducers}>
            <main className="v-stack gap-32">
                <div className="h-stack gap-32">
                    <h2>{t("Продажа USDT")}</h2>

                    {!isExportPage && (
                        <input
                            placeholder="ID Сделки"
                            onClick={() => {
                                console.log("search precessed");
                            }}
                        />
                    )}
                </div>

                <nav className="h-stack gap-32">
                    <Link
                        to={`${getRouteTraderPayIn()}/${transactionType}`}
                        activeClassName={cls.active}
                    >
                        {t("Активные")}
                    </Link>
                    <Link
                        to={`${getRouteTraderPayIn()}/${transactionType}`}
                        activeClassName={cls.active}
                    >
                        {t("Завершенные")}
                    </Link>
                    <Link
                        to={`${getRouteTraderPayIn()}/${transactionType}`}
                        activeClassName={cls.active}
                    >
                        {t("Споры")}
                    </Link>
                    <Link
                        to={`${getRouteTraderPayIn()}/export`}
                        activeClassName={cls.active}
                    >
                        {t("Экспорт")}
                    </Link>
                </nav>

                <Routes>
                    <Route
                        path={TransactionStatusGroup.ACTIVE}
                        element={(
                            <TransactionsTab
                                statusGroup={TransactionStatusGroup.ACTIVE}
                                type={transactionType}
                            />
                        )}
                    />
                    <Route
                        path={TransactionStatusGroup.COMPLETED}
                        element={(
                            <TransactionsTab
                                statusGroup={TransactionStatusGroup.COMPLETED}
                                type={transactionType}
                            />
                        )}
                    />
                    <Route
                        path={TransactionStatusGroup.DISPUTED}
                        element={(
                            <TransactionsTab
                                statusGroup={TransactionStatusGroup.DISPUTED}
                                type={transactionType}
                            />
                        )}
                    />
                    <Route
                        path={TransactionStatusGroup.CHECKING}
                        element={(
                            <TransactionsTab
                                statusGroup={TransactionStatusGroup.CHECKING}
                                type={transactionType}
                            />
                        )}
                    />
                </Routes>
            </main>
        </DynamicReducersLoader>
    );
};

export default TraderPayInPage;

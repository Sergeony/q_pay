import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PayPageTab } from "shared/const/router";
import { TransactionsTab } from "features/TransactionsTab";
import {
    getTransactionTypeFromRepr,
    transactionReducer,
    TransactionStatusGroup,
    TransactionTypeRepr
} from "entities/Transaction";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import { classNames } from "shared/lib/classNames/classNames";
import { bankDetailsReducer } from "entities/BankDetails";
import cls from "./PayPage.module.scss";
import { NavBar } from "./NavBar";

const reducers: Reducers = {
    activeTransactions: transactionReducer,
    bankDetails: bankDetailsReducer,
};

const PayPage = () => {
    const { t } = useTranslation();
    const { type, tab } = useParams<{ type: TransactionTypeRepr, tab: PayPageTab }>();

    if (!type || !tab) return null;

    return (
        <DynamicReducersLoader keepAfterUnmount reducers={reducers}>
            <main className={classNames(cls.main, ["v-stack gap-32"])}>
                <div className="v-stack gap-32">
                    <div className="h-stack gap-32">
                        <h2 className="PageTitle">
                            {type === "in" ? t("pay_in_page_title") : t("pay_out_page_title")}
                        </h2>
                        {tab !== "export" && (
                            <input
                                placeholder={t("ID Сделки")}
                                onClick={() => {
                                    console.log("search precessed");
                                }}
                            />
                        )}
                    </div>
                    <NavBar type={type} />
                </div>
                {
                    tab !== "export" ? (
                        <TransactionsTab
                            type={getTransactionTypeFromRepr(type)}
                            statusGroup={tab}
                        />
                    ) : ( //  TODO: implement export
                        <TransactionsTab
                            type={getTransactionTypeFromRepr(type)}
                            statusGroup={TransactionStatusGroup.ACTIVE}
                        />
                    )
                }
            </main>
        </DynamicReducersLoader>
    );
};

export default PayPage;

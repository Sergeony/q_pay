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
import { SearchIcon } from "shared/ui/_SVG";
import { Field } from "shared/ui/Field/Field";
import { NotFoundPage } from "pages/NotFoundPage";
import cls from "./PayPage.module.scss";
import { NavBar } from "./NavBar";

const reducers: Reducers = {
    activeTransactions: transactionReducer,
    bankDetails: bankDetailsReducer,
};

const PayPage = () => {
    const { t } = useTranslation();
    const { type, tab } = useParams<{ type: TransactionTypeRepr, tab: PayPageTab }>();

    if (!type || !tab
        || ![
            "in",
            "out",
        ].includes(type)
        || ![
            TransactionStatusGroup.ACTIVE,
            TransactionStatusGroup.DISPUTED,
            TransactionStatusGroup.COMPLETED,
            TransactionStatusGroup.CHECKING,
            "export"
        ].includes(tab)
    ) {
        return <NotFoundPage />;
    }

    return (
        <DynamicReducersLoader keepAfterUnmount reducers={reducers}>
            <main className={classNames(cls.main, ["v-stack gap-32"])}>
                <div className="v-stack gap-32">
                    <div className={cls.TitleWrapper}>
                        <h2 className="PageTitle">
                            {type === "in" ? t("pay_in_page_title") : t("pay_out_page_title")}
                        </h2>
                        {tab !== "export" && (
                            <Field
                                label="Search Transaction"
                                hideLabel
                                Icon={SearchIcon}
                                type="search"
                                onClick={() => { console.log("search processed"); }}
                                placeholder={t("ID Сделки")}
                                className={cls.search}
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

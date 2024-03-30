import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TetherIcon } from "shared/ui/_SVG";
import { classNames } from "shared/lib/classNames/classNames";
import {
    getDepositTransactions, getTransactionTypeFromRepr,
    getWithdrawalTransactions,
    Transaction,
    TransactionStatusGroup,
    TransactionTypeRepr,
    useLazyGetTransactionsQuery
} from "entities/Transaction";
import { useSelector } from "react-redux";
import { formatDate, formatTime } from "shared/lib/utils/utils";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "pages/NotFoundPage";
import { ActiveTransactionBlock } from "./ActiveTransactionBlock";
import cls from "./TransactionTab.module.scss";
import { StatusCell } from "./StatusCell";

export const TransactionsTab = memo(() => {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [fetchTransactions] = useLazyGetTransactionsQuery();
    const {
        type,
        payTab: statusGroup,
        userId,
    } = useParams<{ type: TransactionTypeRepr, payTab: TransactionStatusGroup, userId: string }>();

    const activeTransactions = useSelector(
        type === "in"
            ? getDepositTransactions
            : getWithdrawalTransactions
    ) || [];

    useEffect(() => {
        if (statusGroup !== TransactionStatusGroup.ACTIVE) {
            fetchTransactions({ userId, statusGroup, type: getTransactionTypeFromRepr(type) })
                .unwrap()
                .then((data) => setTransactions(data));
        }
    }, [fetchTransactions, userId, statusGroup, type]);

    if (!type
        || ![
            "in",
            "out",
        ].includes(type)
        || (
            statusGroup
            && ![
                TransactionStatusGroup.ACTIVE,
                TransactionStatusGroup.DISPUTED,
                TransactionStatusGroup.COMPLETED,
                TransactionStatusGroup.CHECKING,
            ].includes(statusGroup)
        )
    ) {
        return <NotFoundPage />;
    }

    return (
        <div className={classNames(
            "table",
            [type === "in"
                ? cls.DepositGridTemplate
                : cls.WithdrawalGridTemplate
            ],
            { extended: statusGroup === TransactionStatusGroup.ACTIVE }
        )}
        >
            <div>
                <span />
                <span>{t("ID Сделки")}</span>
                <span>{t("Мой курс")}</span>
                <span>{t("Курс биржи")}</span>
                <span>{t("Клиент")}</span>
                {type === "out" && <span>{t("Карта клиента")}</span>}
                <span>{t("Мои реквизиты")}</span>
                <span>{t("Создана")}</span>
                <span>{t("Подтверждена")}</span>
                <span>{t("Статус")}</span>
            </div>
            {(statusGroup === TransactionStatusGroup.ACTIVE ? activeTransactions : transactions
            )?.map((tr) => (
                <div key={tr.id}>
                    <div>
                        <div className="h-stack gap-4">
                            <div id={`${tr.traderBankDetails.bank}`} />
                            <TetherIcon />
                            <span>{tr.amount}</span>
                        </div>
                    </div>
                    <div><span>{tr.id}</span></div>
                    <div><span>{tr.traderCommission}</span></div>
                    <div><span>{tr.serviceCommission}</span></div>
                    <div><span>{tr.merchant}</span></div>
                    {type === "out" && (
                        <div><span>{tr.clientCardNumber}</span></div>
                    )}
                    <div>
                        <div className="two-line-cell">
                            <div className="h-stack gap-4 alignCenter">
                                <span>{tr.traderBankDetails.title}</span>
                                <span>{tr.traderBankDetails.cardNumber}</span>
                            </div>
                            <span>{tr.traderBankDetails.cardholderName}</span>
                        </div>
                    </div>
                    <div>
                        <div className="two-line-cell">
                            <span>{formatTime(tr.createdAt)}</span>
                            <span>{formatDate(tr.createdAt)}</span>
                        </div>
                    </div>
                    <div>
                        <div className="two-line-cell">
                            <span>{formatTime(tr.completedAt)}</span>
                            <span>{formatDate(tr.completedAt)}</span>
                        </div>
                    </div>
                    <StatusCell
                        status={tr.status}
                        useAutomation={tr.useAutomation}
                    />
                    {statusGroup === TransactionStatusGroup.ACTIVE && (
                        <ActiveTransactionBlock transaction={tr} />
                    )}
                </div>
            ))}
        </div>
    );
});

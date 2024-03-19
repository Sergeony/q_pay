import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    AutomationIcon, AwaitingIcon, FailedIcon, SuccessIcon, TetherIcon
} from "shared/ui/_SVG";
import { classNames } from "shared/lib/classNames/classNames";
import {
    getDepositTransactions,
    getWithdrawalTransactions,
    Transaction,
    TransactionStatus,
    TransactionStatusGroup,
    TransactionStatusRepr,
    TransactionType,
    useLazyGetTransactionsQuery
} from "entities/Transaction";
import { useSelector } from "react-redux";
import { getBankDetails } from "entities/BankDetails";
import { formatDate, formatTime } from "shared/lib/utils/utils";
import cls from "./TransactionTab.module.scss";

interface TransactionsProps {
    userId?: number;
    type: TransactionType
    statusGroup: TransactionStatusGroup;
}

export const TransactionsTab = memo((props: TransactionsProps) => {
    const {
        userId,
        type,
        statusGroup,
    } = props;

    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const activeTransactions = useSelector(
        TransactionType.DEPOSIT ? getDepositTransactions : getWithdrawalTransactions
    ) || [];
    const [fetchTransactions] = useLazyGetTransactionsQuery();

    useEffect(() => {
        if (statusGroup !== TransactionStatusGroup.ACTIVE) {
            fetchTransactions(props).unwrap().then((data) => setTransactions(data));
        }
    }, [fetchTransactions, props, statusGroup]);

    const bds = useSelector(getBankDetails);
    const findBdById = (id: number) => bds?.find((bd) => bd.id === id);

    return (
        <div className={classNames(
            "table",
            [cls.GridTemplate],
            { extended: statusGroup === TransactionStatusGroup.ACTIVE }
        )}
        >
            <div>
                <span>{t("ID Сделки")}</span>
                <span>{t("Мой курс")}</span>
                <span>{t("Курс биржи")}</span>
                <span>{t("Клиент")}</span>
                <span>{t("Мои реквизиты")}</span>
                <span>{t("Создана")}</span>
                <span>{t("Подтверждена")}</span>
                <span>{t("Статус")}</span>
            </div>
            {(statusGroup === TransactionStatusGroup.ACTIVE ? activeTransactions : transactions
            )?.map((tr) => {
                const bd = findBdById(tr.traderBankDetails);

                return (
                    <div key={tr.id}>
                        <div>
                            <div className="h-stack gap-4">
                                <div />
                                <TetherIcon />
                                <span>{tr.amount}</span>
                            </div>
                        </div>
                        <div>
                            <span>{tr.id}</span>
                        </div>
                        <div>
                            <span>{tr.traderCommission}</span>
                        </div>
                        <div>
                            <span>{tr.serviceCommission}</span>
                        </div>
                        <div>
                            <span>{tr.merchant}</span>
                        </div>
                        <div>
                            <div className="two-line-cell">
                                <div>
                                    <span>{bd?.title}</span>
                                    <span>{bd?.cardholderName}</span>
                                </div>
                                <span>{bd?.cardholderName}</span>
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
                        <div className={classNames(
                            cls[TransactionStatusRepr[tr.status]],
                            [],
                            { [cls.auto]: tr.useAutomation }
                        )}
                        >
                            {tr.status === TransactionStatus.COMPLETED
                                && tr.useAutomation && <AutomationIcon useGradient />}
                            {tr.status === TransactionStatus.COMPLETED
                                && !tr.useAutomation && <SuccessIcon useGradient />}
                            {[
                                TransactionStatus.PENDING,
                                TransactionStatus.REVIEWING
                            ].includes(tr.status) && <AwaitingIcon useGradient /> }
                            {[
                                TransactionStatus.FAILED,
                                TransactionStatus.CANCELLED,
                            ].includes(tr.status) && <FailedIcon useGradient />}
                            <span>{TransactionStatusRepr[tr.status]}</span>
                        </div>
                        {statusGroup === TransactionStatusGroup.ACTIVE && (
                            <div>
                                <button
                                    type="button"
                                    disabled={tr.status === TransactionStatus.PENDING}
                                >
                                    {t("confirm")}
                                </button>
                                <span>01:12</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});

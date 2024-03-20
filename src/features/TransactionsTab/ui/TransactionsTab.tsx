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
import { getBankDetails, useLazyFetchBankDetailsQuery } from "entities/BankDetails";
import { formatDate, formatTime } from "shared/lib/utils/utils";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import Timer from "./Timer";
import cls from "./TransactionTab.module.scss";

interface TransactionsProps {
    userId?: number;
    type: TransactionType;
    statusGroup: TransactionStatusGroup;
}

export const TransactionsTab = memo((props: TransactionsProps) => {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [fetchTransactions] = useLazyGetTransactionsQuery();
    const [fetchBankDetails] = useLazyFetchBankDetailsQuery();
    const {
        userId,
        type,
        statusGroup,
    } = props;
    const activeTransactions = useSelector(
        type === TransactionType.IN ? getDepositTransactions : getWithdrawalTransactions
    ) || [];
    useEffect(() => {
        if (statusGroup !== TransactionStatusGroup.ACTIVE) {
            fetchTransactions({ userId, statusGroup, type })
                .unwrap()
                .then((data) => setTransactions(data));
        }
        fetchBankDetails({})
            .then(() => {
            });
    }, [fetchBankDetails, fetchTransactions, userId, statusGroup, type]);

    const bds = useSelector(getBankDetails);
    const findBdById = (id: number) => bds?.find((bd) => bd.id === id);

    if (!type || !statusGroup) return null;

    return (
        <div className={classNames(
            "table",
            [type === TransactionType.IN
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
                <span>{t("Карта клиента")}</span>
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
                        {type === TransactionType.OUT && (
                            <div>
                                <span>{tr.clientCardNumber}</span>
                            </div>
                        )}
                        <div>
                            <div className="two-line-cell">
                                <div className="h-stack gap-4 alignCenter">
                                    <span>{bd?.title}</span>
                                    <span>{bd?.cardNumber}</span>
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
                            ["h-stack", "alignCenter", "gap-4"],
                            { [cls.auto]: tr.useAutomation }
                        )}
                        >
                            {tr.status === TransactionStatus.COMPLETED
                                && tr.useAutomation && <AutomationIcon size={24} useGradient />}
                            {tr.status === TransactionStatus.COMPLETED
                                && !tr.useAutomation && <SuccessIcon size={24} useGradient />}
                            {[
                                TransactionStatus.PENDING,
                                TransactionStatus.REVIEWING
                            ].includes(tr.status) && <AwaitingIcon size={24} useGradient />}
                            {[
                                TransactionStatus.FAILED,
                                TransactionStatus.CANCELLED,
                            ].includes(tr.status) && <FailedIcon size={24} useGradient />}
                            <span>{TransactionStatusRepr[tr.status]}</span>
                        </div>
                        {statusGroup === TransactionStatusGroup.ACTIVE && (
                            <div className={classNames(
                                cls.Extended,
                                ["h-stack gap-16 alignCenter"]
                            )}
                            >
                                <Button
                                    role={ButtonRole.PRIMARY}
                                    disabled={tr.status === TransactionStatus.PENDING}
                                >
                                    {t("confirm")}
                                </Button>
                                <Timer
                                    creationTime={tr.createdAt}
                                    duration={tr.lifetime}
                                    onExpire={() => {
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});

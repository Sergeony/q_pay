import { FC } from "react";

import { classNames } from "shared/lib/classNames/classNames";
import { Transaction, TransactionStatus } from "entities/Transaction";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { webSocketService } from "shared/api/ws";
import { useTranslation } from "react-i18next";
import cls from "./TransactionTab.module.scss";
import Timer from "../../../shared/ui/Timer/Timer";

interface ActiveTransactionBlockProps {
    transaction: Transaction;
}

export const ActiveTransactionBlock: FC<ActiveTransactionBlockProps> = (props) => {
    const { t } = useTranslation();
    const { transaction } = props;

    return (
        <div className={classNames(
            cls.Extended,
            ["h-stack gap-16 alignCenter"]
        )}
        >
            <Button
                role={ButtonRole.PRIMARY}
                disabled={transaction.status === TransactionStatus.PENDING}
                onClick={() => webSocketService.changeTransactionStatus(
                    transaction.id,
                    TransactionStatus.COMPLETED,
                    transaction.amount
                )}
            >
                {t("confirm")}
            </Button>
            <Timer
                creationTime={transaction.createdAt}
                duration={transaction.lifetime}
            />
        </div>
    );
};

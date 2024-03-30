import { classNames } from "shared/lib/classNames/classNames";
import { TransactionStatus, TransactionStatusRepr } from "entities/Transaction";
import { memo } from "react";
import {
    AutomationIcon, AwaitingIcon, FailedIcon, SuccessIcon
} from "shared/ui/_SVG";
import cls from "./TransactionTab.module.scss";

interface StatusCellProps {
    status: TransactionStatus;
    useAutomation: boolean;
}

export const StatusCell = memo((props: StatusCellProps) => {
    const { status, useAutomation } = props;

    return (
        <div className={classNames(
            cls[TransactionStatusRepr[status]],
            ["h-stack", "alignCenter", "gap-4", `${cls[TransactionStatusRepr[status]]}`],
            { [cls.auto]: useAutomation }
        )}
        >
            {status === TransactionStatus.COMPLETED
                && useAutomation && <AutomationIcon className="stroke-blue-gradient" size={24} useGradient />}
            {status === TransactionStatus.COMPLETED
                && !useAutomation && <SuccessIcon size={24} useGradient />}
            {[
                TransactionStatus.PENDING,
                TransactionStatus.REVIEWING
            ].includes(status) && <AwaitingIcon size={24} useGradient />}
            {[
                TransactionStatus.FAILED,
                TransactionStatus.CANCELLED,
            ].includes(status) && <FailedIcon size={24} useGradient />}
            <span>{TransactionStatusRepr[status]}</span>
        </div>
    );
});

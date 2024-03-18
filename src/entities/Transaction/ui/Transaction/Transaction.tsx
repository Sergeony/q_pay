import { classNames } from "shared/lib/classNames/classNames";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import cls from "./Transaction.module.scss";

interface TransactionProps {
    className?: string;
}

export const Transaction = memo((props: TransactionProps) => {
    const { className } = props;
    const { t } = useTranslation();

    return (
        <div className={classNames(cls.Transaction, [], { className })} />
    );
});

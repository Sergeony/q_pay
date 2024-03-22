import React, { memo, ReactNode } from "react";
import styles from "./TransactionTable.module.scss";

interface TransactionCellProps {
    type: "icon" | "text" | "textSmall" | "gradient";
    gradientColor?: "yellow" | "green" | "red";
    // другие пропсы
}

export enum TableCellType {
    ONE_LINE = "one-line",
    TWO_LINE = "two-line",
    GROUP = "group",
    STATUS = "status",

}

interface TableCellProps {
    children: ReactNode;
    type: TableCellType;
}

export const TransactionCell = memo((props: TableCellProps) => {
    const {
        children,
        type,
    } = props;

    return (
        <td>
            {children}
        </td>

    );
});

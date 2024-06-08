import { AwaitingIcon, SuccessIcon, TetherIcon } from "shared/ui/_SVG";
import KebabMenu from "shared/ui/KebabMenu/KebabMenu";
import { useTranslation } from "react-i18next";
import { formatDate, formatTime } from "shared/lib/utils/utils";
import cls from "./BalanceOperations.module.scss";

export const BalanceOperations = () => {
    const { t } = useTranslation();
    const withdrawals = [
        {
            status: 2,
            amount: 173,
            type: 1,
            id: "ee3d39fbf0570fd0373cb85c02216f1b81830caddaa348c4094e05eb2b3981a8",
            wallet: "ASdHfdskjfoiDFhiuosd",
            createdAt: "2024-03-18T19:01:02.331000Z"
        },
        {
            status: 1,
            amount: 173,
            type: 2,
            id: "ee3d39fbf0570fd0373cb85c02216f1b81830caddaa348c4094e05eb2b3981a8",
            wallet: "ASdHfdskjfoiDFhiuosd",
            createdAt: "2024-03-18T19:01:02.331000Z"
        },
        {
            status: 3,
            amount: 173,
            type: 1,
            id: "ee3d39fbf0570fd0373cb85c02216f1b81830caddaa348c4094e05eb2b3981a8",
            wallet: "ASdHfdskjfoiDFhiuosd",
            createdAt: "2024-03-18T19:01:02.331000Z"
        },
    ];

    return (
        <div className={`table max-w-xl ${cls.GridTemplate}`}>
            <div>
                <span>{t("amount_table_column_title")}</span>
                <span>{t("type_table_column_title")}</span>
                <span>{t("tx_id_table_column_title")}</span>
                <span>{t("wallet_table_column_title")}</span>
                <span>{t("date_and_time_table_column_title")}</span>
                <span />
            </div>
            {"true" && withdrawals.map((w) => {
                const Status = w.status === 1 ? AwaitingIcon : SuccessIcon;
                return (
                    <div key={w.id}>
                        <div>
                            <div className="h-stack gap-8 alignCenter">
                                <Status size={24} useGradient />
                                <div className="h-stack gap-4 alignCenter">
                                    <span>{w.amount}</span>
                                    <TetherIcon className="accent-fill" />
                                </div>
                            </div>
                        </div>
                        <div><span>{w.type === 1 ? t("withdrawal") : t("deposit")}</span></div>
                        <div className={w.id}>
                            {/* <div className="h-stack alignCenter"> */}
                            <span className="ellipsis">{w.id.slice(0, -3)}</span>
                            <span>{w.id.slice(-3)}</span>
                            {/* </div> */}
                        </div>
                        <div><span>{w.wallet}</span></div>
                        <div>
                            <div className="two-line-cell">
                                <span>{formatTime(w.createdAt)}</span>
                                <span>{formatDate(w.createdAt)}</span>
                            </div>
                        </div>
                        <div>
                            <KebabMenu />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

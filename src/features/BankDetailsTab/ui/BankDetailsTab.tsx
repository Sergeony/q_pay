import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AutomationIcon } from "shared/ui/_SVG";
import Switch from "shared/ui/Switch/Switch";
import KebabMenu from "shared/ui/KebabMenu/KebabMenu";
import {
    useDeleteBankDetailsMutation,
    useFetchBankDetailsQuery,
    usePatchBankDetailsMutation,
} from "entities/BankDetails";
import { classNames } from "shared/lib/classNames/classNames";
import { useFetchBanksQuery } from "entities/Bank";
import cls from "./BankDetailsTab.module.scss";

interface BankDetailsProps {
    traderId?: number;
}

export const BankDetailsTab = memo((props: BankDetailsProps) => {
    const { t } = useTranslation();
    const [switchBankDetails] = usePatchBankDetailsMutation();
    const [deleteBankDetails] = useDeleteBankDetailsMutation();
    const { traderId } = props;
    const {
        data: bankDetails,
    } = useFetchBankDetailsQuery({ traderId });
    const {
        data: banks,
    } = useFetchBanksQuery();

    const handleDelete = useCallback((id: number) => {
        deleteBankDetails({ id })
            .unwrap()
            .then(() => {
                // TODO: add handling
            })
            .catch(() => {
                // TODO: add handling
            });
    }, [deleteBankDetails]);

    const handleSwitch = useCallback((id: number, isActive: boolean) => {
        switchBankDetails({ id, isActive })
            .unwrap()
            .then(() => {
                // TODO: add handling
            });
    }, [switchBankDetails]);

    const findBankById = useCallback(
        (bankId: number) => banks?.find((b) => b.id === bankId),
        [banks]
    );

    return (
        <div className={classNames("table", [cls.GridTemplate])}>
            <div>
                <span>{t("bank_details_table_bank_column_title")}</span>
                <span>{t("bank_details_table_title_column_title")}</span>
                <span>{t("bank_details_table_card_data_column_title")}</span>
                <span>{t("bank_details_table_daily_column_title")}</span>
                <span>{t("bank_details_table_weekly_column_title")}</span>
                <span>{t("bank_details_table_monthly_column_title")}</span>
                <span>{t("bank_details_table_activity_column_title")}</span>
                <span />
            </div>
            {bankDetails?.map((bd) => {
                const bank = findBankById(bd.bank);
                return (
                    <div key={bd.id}>
                        <div>
                            <div className="h-stack gap-4">
                                {bd.useAutomation && <AutomationIcon />}
                                <div />
                                <span>{bank?.title}</span>
                                <span>{t("UAH")}</span>
                            </div>
                        </div>
                        <div>
                            <span>{bd.title}</span>
                        </div>
                        <div>
                            <div className="two-line-cell">
                                <span>{bd.cardNumber}</span>
                                <span>{bd.cardholderName}</span>
                            </div>
                        </div>
                        <div>
                            <div className="two-line-cell">
                                <span>{bd.currentDailyTurnover}</span>
                                <span>{bd.dailyLimit}</span>
                            </div>
                        </div>
                        <div>
                            <div className="two-line-cell">
                                <span>{bd.currentWeeklyTurnover}</span>
                                <span>{bd.weeklyLimit}</span>
                            </div>
                        </div>
                        <div>
                            <div className="two-line-cell">
                                <span>{bd.currentMonthlyTurnover}</span>
                                <span>{bd.monthlyLimit}</span>
                            </div>
                        </div>
                        <div>
                            <Switch
                                isActive={bd.isActive}
                                onSwitch={() => handleSwitch(bd.id, !bd.isActive)}
                            />
                        </div>
                        <div>
                            <KebabMenu
                                // onEdit={() => {}} // TODO: implement
                                onDelete={() => handleDelete(bd.id)}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { AutomationIcon, CardIcon } from "shared/ui/_SVG";
import Switch from "shared/ui/Switch/Switch";
import KebabMenu from "shared/ui/KebabMenu/KebabMenu";
import {
    AdSchema, useDeleteAdMutation, useFetchAdsQuery, usePatchAdMutation
} from "entities/Ads";
import { classNames } from "shared/lib/classNames/classNames";
import { useFetchBanksQuery } from "entities/Bank";
import { useParams } from "react-router-dom";
import cls from "./AdsTab.module.scss";
import EditAdModal from "./EditAdModal";

export const AdsTab = memo(() => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState<AdSchema | null>(null);
    const { t } = useTranslation();
    const [switchActivity] = usePatchAdMutation();
    const [deleteAd] = useDeleteAdMutation();
    const { userId } = useParams<{ userId: string }>();
    const {
        data: ads,
        isSuccess: adsFetched,
    } = useFetchAdsQuery(
        { userId },
        { refetchOnMountOrArgChange: true }
    );
    const {
        data: banks,
    } = useFetchBanksQuery();

    const findBankById = useCallback(
        (bankId: number) => banks?.find((b) => b.id === bankId),
        [banks]
    );

    const handleDelete = useCallback((id: number) => {
        deleteAd({ id })
            .unwrap()
            .then(() => {
                // TODO: add handling
            })
            .catch(() => {
                // TODO: add handling
            });
    }, [deleteAd]);

    const handleSwitch = useCallback((id: number, isActive: boolean) => {
        switchActivity({ id, isActive })
            .unwrap()
            .then(() => {
                // TODO: add handling
            });
    }, [switchActivity]);

    return (
        <div className={`table max-w-xl ${cls.GridTemplate}`}>
            <div>
                <span>{t("bank_table_column_title")}</span>
                <span>{t("bank_details_table_column_title")}</span>
                <span>{t("activity_table_column_title")}</span>
                <span />
            </div>
            {adsFetched && ads.map((a) => {
                const bank = findBankById(a.bank);
                return (
                    <div key={a.id}>
                        <div>
                            <div className={classNames("", ["h-stack", "gap-8"])}>
                                <div />
                                <span>{bank?.title}</span>
                                <span>{t("UAH")}</span>
                            </div>
                        </div>
                        <div>
                            <div className={cls.BankDetailsContainer}>
                                {a.bankDetails?.map((bd) => (
                                    <div key={bd.id}>
                                        {bd.useAutomation && <AutomationIcon />}
                                        <CardIcon />
                                        <span>{bd.title}</span>
                                        <span>{bd.cardNumber}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Switch
                                isActive={a.isActive}
                                onSwitch={() => handleSwitch(a.id, !a.isActive)}
                            />
                        </div>
                        <div>
                            <KebabMenu
                                onDelete={() => handleDelete(a.id)}
                                onEdit={() => { setModalIsOpen(true); setSelectedAd(a); }}
                            />
                        </div>
                    </div>
                );
            })}
            {modalIsOpen && selectedAd && (
                <EditAdModal
                    onClose={() => { setModalIsOpen(false); setSelectedAd(null); }}
                    ad={selectedAd}
                />
            )}
        </div>
    );
});

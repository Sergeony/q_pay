import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { AutomationIcon, CardIcon } from "shared/ui/_SVG";
import Switch from "shared/ui/Switch/Switch";
import KebabMenu from "shared/ui/KebabMenu/KebabMenu";
import {
    AdSchema, useDeleteAdMutation, useFetchAdsQuery, usePatchAdMutation
} from "entities/Ads";
import { classNames } from "shared/lib/classNames/classNames";
import { bankDetailsReducer, useFetchBankDetailsQuery } from "entities/BankDetails";
import { bankReducer, useFetchBanksQuery } from "entities/Bank";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import cls from "./AdsTab.module.scss";
import EditAdModal from "./EditAdModal";

interface AdsProps {
    traderId?: number;
}

const reducers: Reducers = {
    banks: bankReducer,
    bankDetails: bankDetailsReducer,
};

export const AdsTab = memo((props: AdsProps) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState<AdSchema | null>(null);
    const { t } = useTranslation();
    const [switchActivity] = usePatchAdMutation();
    const [deleteAd] = useDeleteAdMutation();
    const { traderId } = props;
    const {
        data: ads,
        isSuccess: adsFetched,
    } = useFetchAdsQuery({ traderId });
    const {
        data: bankDetails,
    } = useFetchBankDetailsQuery({ traderId });
    const {
        data: banks,
    } = useFetchBanksQuery();

    const findBankById = useCallback(
        (bankId: number) => banks?.find((b) => b.id === bankId),
        [banks]
    );

    const findBankDetailsByAdId = useCallback(
        (adId: number) => bankDetails?.filter((bd) => bd.ad === adId),
        [bankDetails]
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
        <DynamicReducersLoader reducers={reducers} keepAfterUnmount>
            <div className={classNames("table", [cls.GridTemplate])}>
                <div>
                    <span>{t("bank_table_column_title")}</span>
                    <span>{t("bank_details_table_column_title")}</span>
                    <span>{t("activity_table_column_title")}</span>
                    <span />
                </div>
                {adsFetched && ads.map((a) => {
                    const bank = findBankById(a.bank);
                    const bds = findBankDetailsByAdId(a.id);

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
                                    {bds?.map((bd) => (
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
            </div>
            {modalIsOpen && selectedAd && (
                <EditAdModal
                    onClose={() => { setModalIsOpen(false); setSelectedAd(null); }}
                    ad={selectedAd}
                />
            )}
        </DynamicReducersLoader>
    );
});

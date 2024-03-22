import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "shared/ui/Modal/Modal";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { getBankDetails } from "entities/BankDetails";
import { useTranslation } from "react-i18next";
import { classNames } from "shared/lib/classNames/classNames";
import { AdSchema, usePatchAdMutation } from "entities/Ads";
import { memo } from "react";
import { useSelector } from "react-redux";
import cls from "./AdsTab.module.scss";

interface IProps {
    onClose: () => void;
    ad: AdSchema;
}

const useAllBankDetails = (adBank: number) => {
    const bankDetails = useSelector(getBankDetails) || [];
    return bankDetails.filter((bd) => bd.bank === adBank);
};

const EditAdvertisementsModal = memo(({ onClose, ad }: IProps) => {
    const [patchAd] = usePatchAdMutation();
    const { t } = useTranslation();
    const allBankDetails = useAllBankDetails(ad.bank);

    const formik = useFormik({
        initialValues: {
            bankDetailsIds: allBankDetails.filter((bd) => bd.ad === ad.id).map((bd) => bd.id),
        },
        validationSchema: Yup.object({
            bankDetailsIds: Yup.array().of(Yup.number().required("Required"))
                .required("Required")
                .min(0, "Not empty"),
        }),
        onSubmit: async (values) => {
            try {
                const detachIds = allBankDetails.filter((bd) => bd.ad === ad.id).filter(
                    (bd) => !values.bankDetailsIds.find((bdId) => Number(bdId) === Number(bd.id))
                ).map(
                    (bd) => bd.id
                );
                await patchAd({
                    id: ad.id,
                    attachIds: values.bankDetailsIds,
                    detachIds,
                });

                onClose();
            } catch (error) {
                // TODO: add handling
            }
        },
    });

    return (
        <Modal
            hasCloseBtn
            isOpen
            onClose={onClose}
        >
            <div className={classNames(cls.ModalContent, ["v-stack", "gap-32"])}>
                <h2 className="modal-title">
                    {t("Редактирование объявления")}
                </h2>
                <form className={classNames("", ["v-stack gap-32"])} onSubmit={formik.handleSubmit}>
                    <div className={classNames("", ["v-stack gap-8"])}>
                        <label htmlFor="bank-details">{t("Выберите Реквизиты")}</label>
                        <select
                            name="bankDetailsIds"
                            multiple
                            id="bankDetailsIds"
                            onChange={formik.handleChange}
                            value={formik.values.bankDetailsIds.map((bd) => String(bd))}
                        >
                            {allBankDetails?.map((bd) => (
                                <option
                                    key={bd.id}
                                    value={bd.id}
                                    label={`${bd.title} ${bd.cardholderName}`}
                                />
                            ))}
                        </select>
                    </div>
                    <div className={classNames("", ["v-stack", "gap-8"])}>
                        <Button
                            role={ButtonRole.PRIMARY}
                            type="submit"
                        >
                            {t("edit")}
                        </Button>
                        <Button
                            role={ButtonRole.CLEAR}
                            onClick={onClose}
                        >
                            {t("cancel")}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
});

export default EditAdvertisementsModal;

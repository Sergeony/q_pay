import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "shared/ui/Modal/Modal";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { getBankDetails } from "entities/BankDetails";
import { getBanks } from "entities/Bank";
import { useTranslation } from "react-i18next";
import { classNames } from "shared/lib/classNames/classNames";
import { useCreateAdMutation } from "entities/Ads";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import cls from "./AdsTab.module.scss";

interface IProps {
    onClose: () => void;
}

const CreateAdModal = ({ onClose }: IProps) => {
    const [createAd] = useCreateAdMutation();
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            bank: NaN,
            attachIds: [],
        },
        validationSchema: Yup.object({
            bank: Yup.number().required("Required"),
            attachIds: Yup.array().of(Yup.number().required("Required"))
                .required("Required")
                .min(0, "Not empty"),
        }),
        onSubmit: async (values) => {
            try {
                await createAd(values);

                onClose();
            } catch (error) {
                // TODO: add handling
            }
        },
    });

    const banks = useSelector(getBanks);
    const bankDetails = useSelector(getBankDetails);

    const filteredBankDetails = useMemo(
        () => bankDetails?.filter((bd) => bd.bank === Number(formik.values.bank)),
        [bankDetails, formik.values.bank]
    );

    const handleBankChange = useCallback((event: any) => {
        if (event.target.value !== formik.values.bank) {
            formik.values.attachIds = [];
        }
        formik.setFieldValue("bank", event.target.value);
    }, [formik]);

    return (
        <Modal
            hasCloseBtn
            isOpen
            onClose={onClose}
        >
            <div className={classNames(cls.ModalContent, ["v-stack", "gap-32"])}>
                <h2 className="modal-title">
                    {t("Создание объявления")}
                </h2>
                <form className={classNames("", ["v-stack gap-32"])} onSubmit={formik.handleSubmit}>
                    <div className={classNames("", ["v-stack gap-8"])}>
                        <label htmlFor="bank">{t("Выберите банк")}</label>
                        <select
                            name="bank"
                            id="bank"
                            value={formik.values.bank}
                            onChange={handleBankChange}
                        >
                            <option value="" label="Выберите банк" />
                            {banks?.map((b) => (
                                <option key={b.id} value={b.id} label={b.title} />
                            ))}
                        </select>
                    </div>
                    <div className={classNames("", ["v-stack gap-8"])}>
                        <label htmlFor="bank-details">{t("Выберите Реквизиты")}</label>
                        <select
                            name="attachIds"
                            multiple
                            id="attachIds"
                            onChange={formik.handleChange}
                            value={formik.values.attachIds}
                        >
                            {filteredBankDetails?.map((bd) => (
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
                            {t("create")}
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
};

export default CreateAdModal;

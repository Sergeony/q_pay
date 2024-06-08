import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "shared/ui/Modal/Modal";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { getBankDetails } from "entities/BankDetails";
import { useFetchBanksQuery } from "entities/Bank";
import { useTranslation } from "react-i18next";
import { classNames } from "shared/lib/classNames/classNames";
import { useCreateAdMutation } from "entities/Ads";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import DropDown from "shared/ui/DropDown/DropDown";
import { BankIcons } from "shared/ui/_SVG";
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

    const { data: banks, isSuccess: banksFetched } = useFetchBanksQuery();
    const bankDetails = useSelector(getBankDetails);

    const filteredBankDetails = useMemo(
        () => bankDetails?.filter((bd) => bd.bank === Number(formik.values.bank)),
        [bankDetails, formik.values.bank]
    );

    const handleBankChange = useCallback((value: number) => {
        if (value !== formik.values.bank) {
            formik.values.attachIds = [];
        }
        formik.setFieldValue("bank", value);
    }, [formik]);

    return (
        <Modal
            hasCloseBtn
            isOpen
            onClose={onClose}
        >
            <div className={`${cls.ModalContent} v-stack gap-32`}>
                <h2 className="modal-title">
                    {t("Создание объявления")}
                </h2>
                <form className={classNames("", ["v-stack gap-32"])} onSubmit={formik.handleSubmit}>
                    <DropDown
                        name="bank"
                        id="bank"
                        onChange={handleBankChange}
                        value={formik.values.bank}
                        options={banksFetched ? banks.map((b) => {
                            const BankIcon = BankIcons[b.id];
                            return {
                                value: b.id,
                                content: {
                                    text: b.title,
                                    icon: <BankIcon size={16} />,
                                },
                            };
                        }) : []}
                        placeholder={t("Выберите банк")}
                        className="br-width-1"
                        label={t("Выберите банк")}
                    />
                    <div className="v-stack gap-8">
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
                    <div className="v-stack gap-8">
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

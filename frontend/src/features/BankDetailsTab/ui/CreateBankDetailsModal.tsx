import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "shared/ui/Modal/Modal";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useCreateBankDetailsMutation } from "entities/BankDetails";
import { useFetchBanksQuery } from "entities/Bank";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import Switch from "shared/ui/Switch/Switch";
import { Field } from "shared/ui/Field/Field";
import DropDown from "shared/ui/DropDown/DropDown";
import { BankIcons } from "shared/ui/_SVG";
import cls from "./BankDetailsTab.module.scss";

interface IProps {
    onClose: () => void;
}

const CreateBankDetailsModal = ({ onClose }: IProps) => {
    const { t } = useTranslation();
    const [createBankDetails] = useCreateBankDetailsMutation();

    const formik = useFormik({
        initialValues: {
            bank: undefined,
            cardNumber: "",
            cardholderName: "", //  FIXME: replace with cardholderName
            title: "",
            dailyLimit: undefined,
            weeklyLimit: undefined,
            monthlyLimit: undefined,
            currentDailyTurnover: undefined,
            currentWeeklyTurnover: undefined,
            currentMonthlyTurnover: undefined,
            useAutomation: false,
        },
        validationSchema: Yup.object({
            bank: Yup.number(),
            cardNumber: Yup.string().length(16).matches(/^\d{16}$/),
            cardholderName: Yup.string(),
            title: Yup.string(),
            dailyLimit: Yup.number(),
            weeklyLimit: Yup.number(),
            monthlyLimit: Yup.number(),
            currentDailyTurnover: Yup.number(),
            currentWeeklyTurnover: Yup.number(),
            currentMonthlyTurnover: Yup.number(),
            useAutomation: Yup.boolean(),
        }),
        onSubmit: async (values) => {
            try {
                await createBankDetails(values);

                onClose();
            } catch (error) {
                // TODO: add handling
            }
        },
    });

    const { data: banks, isSuccess: banksFetched } = useFetchBanksQuery();

    const handleSwitch = useCallback(() => {
        formik.setFieldValue("useAutomation", !formik.values.useAutomation);
    }, [formik]);

    const handleBankChange = useCallback((value: number) => {
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
                    {t("Создание Реквизитов")}
                </h2>
                <form className="v-stack gap-32" onSubmit={formik.handleSubmit}>
                    <div className="v-stack gap-8">
                        <label htmlFor="bank">{t("Выберите банк")}</label>
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
                        />
                    </div>
                    <Field
                        name="cardNumber"
                        id="card-number"
                        label={t("Номер Карты")}
                        placeholder={t("Номер Карты")}
                        onChange={formik.handleChange}
                        value={formik.values.cardNumber}
                        error={formik.touched.cardNumber
                            && formik.errors.cardNumber}
                    />
                    <Field
                        name="cardholderName"
                        id="cardholder-name"
                        label={t("Фамилия и Имя")}
                        placeholder={t("Фамилия и Имя")}
                        onChange={formik.handleChange}
                        value={formik.values.cardholderName}
                        error={formik.touched.cardholderName
                            && formik.errors.cardholderName}
                    />
                    <Field
                        name="title"
                        id="bd-title"
                        label={t("Название Реквизитов")}
                        placeholder={t("Название Реквизитов")}
                        onChange={formik.handleChange}
                        value={formik.values.title}
                        error={formik.touched.title
                            && formik.errors.title}
                    />
                    <div className="h-stack gap-8 justifyBetween">
                        <Field
                            name="dailyLimit"
                            id="daily-limit"
                            label={t("Дневной лимит")}
                            placeholder={t("Дневной лимит")}
                            onChange={formik.handleChange}
                            value={formik.values.dailyLimit}
                            error={formik.touched.dailyLimit
                                && formik.errors.dailyLimit}
                        />
                        <Field
                            name="currentDailyTurnover"
                            id="daily-turnover"
                            label={t("Использовано")}
                            placeholder={t("Использовано")}
                            onChange={formik.handleChange}
                            value={formik.values.currentDailyTurnover}
                            error={formik.touched.currentDailyTurnover
                                && formik.errors.currentDailyTurnover}
                        />
                    </div>
                    <div className="h-stack gap-8 justifyBetween">
                        <Field
                            name="weeklyLimit"
                            id="weekly-limit"
                            label={t("Недельный лимит")}
                            placeholder={t("Недельный лимит")}
                            onChange={formik.handleChange}
                            value={formik.values.weeklyLimit}
                            error={formik.touched.weeklyLimit
                                && formik.errors.weeklyLimit}
                        />
                        <Field
                            name="currentWeeklyTurnover"
                            id="weekly-turnover"
                            label={t("Использовано")}
                            placeholder={t("Использовано")}
                            onChange={formik.handleChange}
                            value={formik.values.currentWeeklyTurnover}
                            error={formik.touched.currentWeeklyTurnover
                                && formik.errors.currentWeeklyTurnover}
                        />
                    </div>
                    <div className="h-stack gap-8 justifyBetween">
                        <Field
                            name="monthlyLimit"
                            id="monthly-limit"
                            label={t("Месячный лимит")}
                            placeholder={t("Месячный лимит")}
                            onChange={formik.handleChange}
                            value={formik.values.monthlyLimit}
                            error={formik.touched.monthlyLimit
                                && formik.errors.monthlyLimit}
                        />
                        <Field
                            name="currentMonthlyTurnover"
                            id="monthly-turnover"
                            label={t("Использовано")}
                            placeholder={t("Использовано")}
                            onChange={formik.handleChange}
                            value={formik.values.currentMonthlyTurnover}
                            error={formik.touched.currentMonthlyTurnover
                                && formik.errors.currentMonthlyTurnover}
                        />
                    </div>
                    <div className="h-stack gap-8 alignCenter">
                        <span>{`${t("Использовать автоматизацию")}:`}</span>
                        <Switch
                            isActive={formik.values.useAutomation}
                            onSwitch={handleSwitch}
                        />
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

export default CreateBankDetailsModal;

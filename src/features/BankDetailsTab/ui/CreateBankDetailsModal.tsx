import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "shared/ui/Modal/Modal";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useCreateBankDetailsMutation } from "entities/BankDetails";
import { useFetchBanksQuery } from "entities/Bank";
import { useTranslation } from "react-i18next";
import { classNames } from "shared/lib/classNames/classNames";
import { useCallback } from "react";
import Switch from "shared/ui/Switch/Switch";
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

    return (
        <Modal
            hasCloseBtn
            isOpen
            onClose={onClose}
        >
            <div className={classNames(cls.ModalContent, ["v-stack", "gap-32"])}>
                <h2 className="modal-title">
                    {t("Создание Реквизитов")}
                </h2>
                <form className={classNames("", ["v-stack gap-32"])} onSubmit={formik.handleSubmit}>
                    <div className={classNames("", ["v-stack gap-8"])}>
                        <label htmlFor="bank">{t("Выберите банк")}</label>
                        <select
                            name="bank"
                            id="bank"
                            onChange={formik.handleChange}
                            value={formik.values.bank}
                        >
                            <option value="" label="Выберите банк" />
                            {banksFetched && banks.map((b) => (
                                <option key={b.id} value={b.id} label={b.title} />
                            ))}
                        </select>
                        {formik.touched.bank
                            && formik.errors.bank
                            && (
                                <div>{formik.errors.bank}</div>
                            )}
                    </div>
                    <div className={classNames("", ["v-stack gap-8"])}>
                        <label htmlFor="card-number">{t("Номер Карты")}</label>
                        <input
                            name="cardNumber"
                            id="card-number"
                            onChange={formik.handleChange}
                            value={formik.values.cardNumber}
                        />
                        {formik.touched.cardNumber
                            && formik.errors.cardNumber
                            && (
                                <div>{formik.errors.cardNumber}</div>
                            )}
                    </div>
                    <div className={classNames("", ["v-stack gap-8"])}>
                        <label htmlFor="cardholder-name">{t("Фамилия и Имя")}</label>
                        <input
                            name="cardholderName"
                            id="cardholder-name"
                            onChange={formik.handleChange}
                            value={formik.values.cardholderName}
                        />
                        {formik.touched.cardholderName
                            && formik.errors.cardholderName
                            && (
                                <div>{formik.errors.cardholderName}</div>
                            )}
                    </div>
                    <div className={classNames("", ["v-stack gap-8"])}>
                        <label htmlFor="bd-title">{t("Название Реквизитов")}</label>
                        <input
                            name="title"
                            id="bd-title"
                            onChange={formik.handleChange}
                            value={formik.values.title}
                        />
                        {formik.touched.title
                            && formik.errors.title
                            && (
                                <div>{formik.errors.title}</div>
                            )}
                    </div>

                    <div className={classNames("", ["h-stack", "gap-8"])}>
                        <div className={classNames("", ["v-stack gap-8"])}>
                            <label htmlFor="daily-limit">{t("Дневной лимит")}</label>
                            <input
                                name="dailyLimit"
                                id="daily-limit"
                                onChange={formik.handleChange}
                                value={formik.values.dailyLimit}
                            />
                            {formik.touched.dailyLimit
                                && formik.errors.dailyLimit
                                && (
                                    <div>{formik.errors.dailyLimit}</div>
                                )}
                        </div>
                        <div className={classNames("", ["v-stack gap-8"])}>
                            <label htmlFor="daily-turnover">{t("Использовано")}</label>
                            <input
                                name="currentDailyTurnover"
                                id="daily-turnover"
                                onChange={formik.handleChange}
                                value={formik.values.currentDailyTurnover}
                            />
                            {formik.touched.currentDailyTurnover
                                && formik.errors.currentDailyTurnover
                                && (
                                    <div>{formik.errors.currentDailyTurnover}</div>
                                )}
                        </div>
                    </div>
                    <div className={classNames("", ["h-stack", "gap-8"])}>
                        <div className={classNames("", ["v-stack gap-8"])}>
                            <label htmlFor="weekly-limit">{t("Недельный лимит")}</label>
                            <input
                                name="weeklyLimit"
                                id="weekly-limit"
                                onChange={formik.handleChange}
                                value={formik.values.weeklyLimit}
                            />
                            {formik.touched.weeklyLimit
                                && formik.errors.weeklyLimit
                                && (
                                    <div>{formik.errors.weeklyLimit}</div>
                                )}
                        </div>
                        <div className={classNames("", ["v-stack gap-8"])}>
                            <label htmlFor="weekly-turnover">{t("Использовано")}</label>
                            <input
                                name="currentWeeklyTurnover"
                                id="weekly-turnover"
                                onChange={formik.handleChange}
                                value={formik.values.currentWeeklyTurnover}
                            />
                            {formik.touched.currentWeeklyTurnover
                                && formik.errors.currentWeeklyTurnover
                                && (
                                    <div>{formik.errors.currentWeeklyTurnover}</div>
                                )}
                        </div>
                    </div>
                    <div className={classNames("", ["h-stack", "gap-8"])}>
                        <div className={classNames("", ["v-stack gap-8"])}>
                            <label htmlFor="monthly-limit">{t("Месячный лимит")}</label>
                            <input
                                name="monthlyLimit"
                                id="monthly-limit"
                                onChange={formik.handleChange}
                                value={formik.values.monthlyLimit}
                            />
                            {formik.touched.monthlyLimit
                                && formik.errors.monthlyLimit
                                && (
                                    <div>{formik.errors.monthlyLimit}</div>
                                )}
                        </div>
                        <div className={classNames("", ["v-stack gap-8"])}>
                            <label htmlFor="monthly-turnover">{t("Использовано")}</label>
                            <input
                                name="currentMonthlyTurnover"
                                id="monthly-turnover"
                                onChange={formik.handleChange}
                                value={formik.values.currentMonthlyTurnover}
                            />
                        </div>
                        {formik.touched.currentMonthlyTurnover
                            && formik.errors.currentMonthlyTurnover
                            && (
                                <div>{formik.errors.currentMonthlyTurnover}</div>
                            )}
                    </div>
                    <div className={classNames("", ["h-stack gap-8"])}>
                        <span>{`${t("Использовать автоматизацию")}:`}</span>
                        <Switch
                            isActive={formik.values.useAutomation}
                            onSwitch={handleSwitch}
                        />
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

export default CreateBankDetailsModal;

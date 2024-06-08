import { SnowFlakeIcon, TetherIcon } from "shared/ui/_SVG";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { Field } from "shared/ui/Field/Field";
import DropDown from "shared/ui/DropDown/DropDown";
import { useTranslation } from "react-i18next";
import { Checkbox } from "shared/ui/Checkbox/Checkbox";
import { BalanceOperations } from "features/BalanceOperations/ui/BalanceOperations";
import cls from "./BalancePage.module.scss";

const BalancePage = () => {
    const [formIsActive, setFormIsActive] = useState<boolean>(false);
    const { t } = useTranslation();
    const formRef = useRef<HTMLDivElement>(null);
    const currencies = [{ content: "Tether", value: "USDT" }, { content: "Гринва", value: "UAH" }];

    const formik = useFormik({
        initialValues: {
            amount: "",
            wallet: "",
            currency: currencies[0].value,
            agreeTerms: false,
        },
        validationSchema: yup.object({
            amount: yup.number().required("Amount required"),
            wallet: yup.string().required("Wallet required"),
            currency: yup.string().required("Currency required"),
            agreeTerms: yup.boolean().required("Agree Terms required"),
        }),
        onSubmit: async (values) => {
            try {
                // TODO: implement request
                alert(`Request to withdraw ${values.amount} ${values.currency} to ${values.wallet} wallet.`);
                setFormIsActive(false);
            } catch (error) {
                console.error("Ошибка оформления заявки на вывод:", error);
            }
        },
        isInitialValid: false,
    });

    const handleCurrencyChange = (value: string) => {
        formik.setFieldValue("currency", value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setFormIsActive(false);
                formik.resetForm();
            }
        };
        if (formIsActive) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            if (formIsActive) {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        };
    }, [formIsActive, formRef, formik]);

    return (
        // <DynamicReducersLoader reducers={}>
        <main className="w-full max-w-xl px-2rem v-stack gap-32">
            <h1 className="PageTitle">{t("balance_page_title")}</h1>

            <div className="h-stack gap-16">
                <div className={`h-stack gap-4 alignCenter ${cls.ActiveBalanceBlock}`}>
                    <span>10 573</span>
                    <TetherIcon size={32} />
                </div>
                <div className={`h-stack gap-4 alignCenter ${cls.FrozenBalanceBlock}`}>
                    <span>5 438</span>
                    <SnowFlakeIcon size={24} />
                </div>
            </div>

            {!formIsActive
                ? (
                    <Button
                        role={ButtonRole.PRIMARY}
                        onClick={() => setFormIsActive(true)}
                        className={cls.WithdrawalButton}
                    >
                        {t("request_withdrawal")}
                    </Button>
                )
                : (
                    <form
                        onSubmit={formik.handleSubmit}
                        className={cls.WithdrawalForm}
                    >
                        <div className="h-stack gap-16">
                            <Field
                                name="amount"
                                id="amount"
                                type="text"
                                label={t("Введите сумму")}
                                onChange={formik.handleChange}
                                value={formik.values.amount}
                            />
                            <DropDown
                                name="currency"
                                id="currency"
                                options={currencies}
                                value={formik.values.currency}
                                onChange={handleCurrencyChange}
                                className={cls.CurrencySelect}
                                label={t("Валюта")}
                            />
                        </div>
                        <Field
                            name="wallet"
                            id="wallet"
                            label={t("Введите адресс кошелька")}
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.wallet}
                        />

                        <Button
                            role={ButtonRole.PRIMARY}
                            disabled={
                                formik.isSubmitting
                                // || isLoading
                                || !formik.isValid
                            }
                            type="submit"
                        >
                            {t("Submit")}
                        </Button>
                        <Checkbox
                            id="agreeTerms"
                            name="agreeTerms"
                            value={formik.values.agreeTerms}
                            onChange={formik.handleChange}
                            label={t("Соглашаюсь с условиями использования")}
                        />
                        <div className={cls.WithdrawalDescription}>
                            <span>*</span>
                            <p>
                                {t("balance_withdrawal_description")}
                            </p>
                        </div>
                    </form>
                )}

            <h3 className="h3">{t("История операций")}</h3>

            <BalanceOperations />
        </main>
        // </DynamicReducersLoader>
    );
};

export default BalancePage;

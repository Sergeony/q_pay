import { memo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { getTT } from "../model/selectors/getTT";
import { useVerifyTotpMutation } from "../model/services/authService";
import cls from "./Auth.module.scss";

const useValidationSchema = () => {
    const { t } = useTranslation();

    return yup.object({
        totp: yup.string().required(t("required")),
    });
};

export const VerifyTotpForm = memo(() => {
    const { t } = useTranslation();
    const tt = useSelector(getTT);
    const [verifyTotp, { isLoading }] = useVerifyTotpMutation();
    const navigate = useNavigate();
    const validationSchema = useValidationSchema();

    const formik = useFormik({
        initialValues: { totp: "" },
        validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            verifyTotp({ totp: values.totp, tt }).unwrap()
                .then(() => {
                    navigate("/");
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
    });

    return (
        <>
            <div>
                <h2>{t("Верификация")}</h2>
            </div>
            <div>
                <p>{t("Введите код подтверждения.")}</p>
                <form className={cls.VerifyTotpForm} onSubmit={formik.handleSubmit}>
                    <div className="custom-field">
                        <Input
                            id="totp"
                            name="totp"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.totp}
                            placeholder={t("totp_placeholder")}
                        />
                    </div>
                    {formik.touched.totp && formik.errors.totp && (
                        <div className={cls.error}>{formik.errors.totp}</div>
                    )}

                    <Button
                        type="submit"
                        disabled={formik.isSubmitting || isLoading}
                        role={ButtonRole.PRIMARY}
                    >
                        {t("verify_totp_btn")}
                    </Button>
                </form>
            </div>
        </>
    );
});

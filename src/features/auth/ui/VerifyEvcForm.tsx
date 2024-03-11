import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch";
import { memo, useCallback, useState } from "react";
import { RoutePath } from "shared/config/routeConfig/routeConfig";
import { HStack } from "shared/ui/Stack";
import { getAuthEmail } from "../model/selectors/getSignInFormEmail";
import { useResendEvcMutation, useVerifyEvcMutation } from "../model/services/authService";
import { authActions } from "../model/slice/authSlice";
import cls from "./Auth.module.scss";

const useValidationSchema = () => {
    const { t } = useTranslation();

    return yup.object({
        evc: yup.string().required(t("required")),
    });
};

export const VerifyEvcForm = memo(() => {
    const { t } = useTranslation();
    const email = useSelector(getAuthEmail); // Убедитесь, что селектор getAuthEmail правильно реализован
    const dispatch = useAppDispatch();
    const [verifyEvc, { isLoading: isEvcLoading }] = useVerifyEvcMutation();
    const [resendEvc, { isLoading: isResendLoading }] = useResendEvcMutation();
    const [ttlError, setTtlError] = useState<number | null>(null);
    const navigate = useNavigate();
    const validationSchema = useValidationSchema();

    const formik = useFormik({
        initialValues: { evc: "" },
        validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            verifyEvc({ evc: values.evc, email }).unwrap()
                .then((response) => {
                    dispatch(authActions.setTotpBase32(response.totpBase32));
                    dispatch(authActions.setTT(response.tt));
                    navigate(RoutePath.totp_secret);
                })
                .catch((error) => {
                    if (error.status === 400) {
                        resetForm();
                    } else if (error.status === 404) {
                        alert("CONTACT US: @tgusername");
                    } else {
                        alert(`UNKNOWN ERROR: ${error}`);
                    }
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
    });

    const onResend = useCallback(() => {
        resendEvc({
            email,
        }).unwrap()
            .then((response) => {

            }).catch((error) => {
                if (error.status === 409) {
                    navigate(RoutePath.totp_secret);
                } else if (error.status === 429) {
                    const { ttl } = error.data.data;
                    setTtlError(ttl);
                }
            });
    }, [email, navigate, resendEvc]);

    return (
        <>
            <div>
                <h2>{t("Подтвердите почту")}</h2>
            </div>
            <div>
                <p>{t("Вам на почту было отправлено письмо с кодом подтверждения.")}</p>

                <form className={cls.VerifyEvcForm} onSubmit={formik.handleSubmit}>
                    <div className="custom-field">
                        <Input
                            id="evc"
                            name="evc"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.evc}
                            placeholder={t("evc_placeholder")}
                        />
                    </div>
                    {formik.touched.evc && formik.errors.evc && (
                        <div className={cls.error}>{formik.errors.evc}</div>
                    )}

                    <HStack gap="16">
                        <Button
                            type="submit"
                            disabled={formik.isSubmitting || isEvcLoading}
                            role={ButtonRole.PRIMARY}
                        >
                            {t("verify_email_btn")}
                        </Button>
                        <Button
                            type="button"
                            disabled={formik.isSubmitting || isEvcLoading}
                            role={ButtonRole.CANCEL}
                            onClick={onResend}
                        >
                            {t("resend_evc_btn")}
                        </Button>
                    </HStack>
                    {ttlError && <div className={cls.error}>{`${t("wait_to_resend")}: ${ttlError}`}</div>}
                </form>
            </div>
        </>
    );
});

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch";
import {
    memo, useCallback, useEffect, useState
} from "react";
import { getRouteNotFound, getRouteSetupTotp, getRouteVerifyEmail } from "shared/const/router";
import { Field, FieldVariant } from "shared/ui/Field/Field";
import { useResendEvcMutation, useVerifyEmailMutation } from "../api/authService";
import { getAuthEmail } from "../model/selectors/getAuthEmail";
import { authActions } from "../model/slice/authSlice";
import cls from "./Auth.module.scss";

const validationSchema = yup.object({
    evc: yup.string().required(),
});

interface FormSchema {
    evc: string;
}

const initialValues: FormSchema = {
    evc: "",
};

export const VerifyEmailForm = memo(() => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const email = useSelector(getAuthEmail);
    const [verifyEmail, { isLoading: isVerifyEmailPerforming }] = useVerifyEmailMutation();
    const [resendEvc, { isLoading: isResendEvcPerforming }] = useResendEvcMutation();
    const [cdt, setCdt] = useState<number | null>(null);

    const onSubmit = useCallback((
        values: FormSchema,
        { setSubmitting, resetForm }: FormikHelpers<FormSchema>
    ) => {
        verifyEmail({
            evc: values.evc,
            email,
        }).unwrap()
            .then((response) => {
                dispatch(authActions.setTotpSecret(response.data.totpBase32));
                dispatch(authActions.setTt(response.data.tt));
                navigate(getRouteSetupTotp());
            })
            .catch((error) => {
                if (error.status === 400) {
                    resetForm();
                }
                // TODO: handle the rest errors
            })
            .finally(() => {
                setSubmitting(false);
            });
    }, [dispatch, email, navigate, verifyEmail]);

    const formik = useFormik({
        validationSchema,
        initialValues,
        onSubmit,
        isInitialValid: false,
    });

    useEffect(() => {
        if (!email) {
            navigate(getRouteNotFound());
        }
    }, [email, navigate]);

    const onResend = useCallback(() => {
        resendEvc({
            email,
        }).unwrap()
            .then(() => {

            }).catch((error) => {
                if (error.status === 409) {
                    navigate(getRouteVerifyEmail());
                } else if (error.status === 429) {
                    const { ttl } = error.data.data;
                    setCdt(ttl);
                }
            });
    }, [email, navigate, resendEvc]);

    return (
        <main className={cls.main}>
            <section aria-labelledby="verify-email-heading" className="v-stack gap-32">
                <h1 id="verify-email-heading" className="PageTitle">
                    {t("verify_email_page_title")}
                </h1>
                <p>{t("verify_email_page_description")}</p>

                <form
                    className="v-stack gap-32"
                    onSubmit={formik.handleSubmit}
                >
                    <Field
                        variant={FieldVariant.SECURE}
                        label={t("evc_label")}
                        placeholder={t("evc_placeholder")}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.evc}
                        error={formik.touched.evc && formik.errors.evc}
                        id="evc"
                        name="evc"
                        type="text"
                    />
                    <div className="h-stack gap-16">
                        <Button
                            type="submit"
                            role={ButtonRole.PRIMARY}
                            disabled={
                                formik.isSubmitting
                                || isVerifyEmailPerforming
                                || !formik.isValid
                            }
                        >
                            {t("verify_email_btn")}
                        </Button>
                        <Button
                            type="button"
                            role={ButtonRole.CANCEL}
                            disabled={
                                formik.isSubmitting
                                || isResendEvcPerforming
                            }
                            onClick={onResend}
                        >
                            {t("resend_evc_btn")}
                        </Button>
                    </div>
                    {cdt && (
                        <div className={cls.error}>
                            {`${t("wait_to_resend")}: ${cdt}`}
                        </div>
                    )}
                </form>
            </section>
        </main>
    );
});

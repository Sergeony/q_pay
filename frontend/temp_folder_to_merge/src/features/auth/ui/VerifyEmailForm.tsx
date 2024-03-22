import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch";
import { memo, useCallback, useState } from "react";
import { HStack } from "shared/ui/Stack";
import { getRouteSetupTotp, getRouteVerifyEmail } from "shared/const/router";
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
    });

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
        <>
            <div>
                <h2>{t("verify_email_page_title")}</h2>
            </div>
            <div>
                <p>{t("verify_email_page_description")}</p>
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
                            disabled={formik.isSubmitting || isVerifyEmailPerforming}
                            role={ButtonRole.PRIMARY}
                        >
                            {t("verify_email_btn")}
                        </Button>
                        <Button
                            type="button"
                            disabled={formik.isSubmitting || isResendEvcPerforming}
                            role={ButtonRole.CANCEL}
                            onClick={onResend}
                        >
                            {t("resend_evc_btn")}
                        </Button>
                    </HStack>
                    {cdt && (
                        <div className={cls.error}>
                            {`${t("wait_to_resend")}: ${cdt}`}
                        </div>
                    )}
                </form>
            </div>
        </>
    );
});

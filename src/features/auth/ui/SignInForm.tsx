import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { RoutePath } from "shared/config/routeConfig/routeConfig";
import { useSignInMutation } from "../model/services/authService";
import { authActions, authReducer } from "../model/slice/authSlice";
import cls from "./Auth.module.scss";

const reducers: Reducers = {
    auth: authReducer
};

const useValidationSchema = () => {
    const { t } = useTranslation();

    return yup.object({
        email: yup.string().email(t("invalid_email_address")).required(t("required")),
        password: yup.string().required(t("required")),
    });
};

export const SignInForm = memo(() => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [signIn, { isLoading }] = useSignInMutation();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState("");
    const validationSchema = useValidationSchema();

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema,
        onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
            signIn(values).unwrap()
                .then((response) => {
                    dispatch(authActions.setTT(response.tt));
                    navigate(RoutePath.verify_totp);
                })
                .catch((error) => {
                    const { data } = error;
                    if (error.status === 404) {
                        resetForm();
                    } else if (error.status === 403 && data.errors[0] === "totp_not_setup") {
                        console.log(error);
                        dispatch(authActions.setTT(error.data.tt));
                        dispatch(authActions.setTotpBase32(error.data.totpBase32));
                        navigate(RoutePath.totp_secret);
                    } else if (error.status === 403 && data.errors[0] === "email_not_verified") {
                        dispatch(authActions.setEmail(values.email));
                        navigate(RoutePath.verify_evc);
                    }
                    setSubmitError(t("sign_in_error"));
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
    });

    return (
        <>
            <div>
                <h2>{t("Вход")}</h2>
            </div>
            <div>
                <DynamicReducersLoader keepAfterUnmount reducers={reducers}>
                    <form className={cls.SignInForm} onSubmit={formik.handleSubmit}>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            placeholder={t("email_placeholder")}

                        />
                        {formik.touched.email && formik.errors.email && (
                            <div>{formik.errors.email}</div>
                        )}
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            placeholder={t("password_placeholder")}

                        />
                        {formik.touched.password && formik.errors.password && (
                            <div>{formik.errors.password}</div>
                        )}
                        <Button
                            type="submit"
                            disabled={formik.isSubmitting || isLoading}
                            role={ButtonRole.PRIMARY}
                        >
                            {t("sign_in_btn")}
                        </Button>
                        {submitError && <div className={cls.error}>{submitError}</div>}
                    </form>
                </DynamicReducersLoader>
            </div>
        </>
    );
});

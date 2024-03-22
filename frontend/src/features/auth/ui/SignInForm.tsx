import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch";
import { FormikHelpers, useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { getRouteVerifyEmail, getRouteVerifyTotp, getRouteSetupTotp } from "shared/const/router";
import { useSignInMutation } from "../api/authService";
import { authActions, authReducer } from "../model/slice/authSlice";
import cls from "./Auth.module.scss";

const reducers: Reducers = {
    auth: authReducer
};

yup.setLocale({
    mixed: {
        required: "required",
    },
    string: {
        email: "invalid_email_address",
    },
});

const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

interface FormSchema {
    email: string,
    password: string,
}

const initialValues: FormSchema = {
    email: "",
    password: "",
};

export const SignInForm = memo(() => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [signIn, { isLoading }] = useSignInMutation();
    const navigate = useNavigate();

    const onSubmit = useCallback((
        values: FormSchema,
        { setSubmitting, resetForm }: FormikHelpers<FormSchema>
    ) => {
        signIn(values).unwrap()
            .then((response) => {
                dispatch(authActions.setTt(response.data.tt));
                navigate(getRouteVerifyTotp());
            })
            .catch((error) => {
                const { data } = error;
                if (error.status === 404) {
                    resetForm();
                } else if (error.status === 403 && data.errors[0] === "email_not_verified") {
                    dispatch(authActions.setEmail(values.email));
                    navigate(getRouteVerifyEmail());
                } else if (error.status === 403 && data.errors[0] === "totp_not_setup") {
                    dispatch(authActions.setTt(error.data.tt));
                    dispatch(authActions.setTotpSecret(error.data.totpBase32));
                    navigate(getRouteSetupTotp());
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    }, [dispatch, navigate, signIn]);

    const formik = useFormik({
        validationSchema,
        initialValues,
        onSubmit,
    });

    return (
        <>
            <div>
                <h2>{t("sign_in_page_title")}</h2>
            </div>
            <div>
                <DynamicReducersLoader
                    keepAfterUnmount
                    reducers={reducers}
                >
                    <form
                        className={cls.SignInForm}
                        onSubmit={formik.handleSubmit}
                    >
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
                    </form>
                </DynamicReducersLoader>
            </div>
        </>
    );
});

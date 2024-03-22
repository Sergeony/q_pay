import { FormikHelpers, useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import {
    memo, useCallback, useEffect, useMemo, useState
} from "react";
import { getRouteLogin, getRouteNotFound, getRouteVerifyEmail } from "shared/const/router";
import { useSignUpMutation } from "../api/authService";
import { authActions, authReducer } from "../model/slice/authSlice";
import cls from "./Auth.module.scss";

yup.setLocale({
    mixed: {
        required: "required",
    },
    string: {
        email: "invalid_email_address",
        matches: "password_must_match",
    },
});

const reducers: Reducers = {
    auth: authReducer
};

const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    confirmPassword: yup.string().oneOf([yup.ref("password")]).required(),
    tgUsername: yup.string(),
});

interface FormSchema {
    email: string;
    password: string;
    confirmPassword: string;
    tgUsername?: string;
}

const initialValues: FormSchema = {
    email: "",
    password: "",
    confirmPassword: "",
    tgUsername: "",
};

export const SignUpForm = memo(() => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { t } = useTranslation();
    const [signUp, { isLoading: isSignUpPerforming }] = useSignUpMutation();
    const [submitError, setSubmitError] = useState<string>("");

    const inviteCode = useMemo(() => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get("invite-code") || "";
    }, [location.search]);

    useEffect(() => {
        if (!inviteCode) {
            navigate(getRouteNotFound());
        }
    }, [inviteCode, navigate]);

    const onSubmit = useCallback((
        values: FormSchema,
        { setSubmitting }: FormikHelpers<FormSchema>
    ) => {
        signUp({
            inviteCode,
            password: values.password,
            email: values.email,
            tgUsername: values.tgUsername,
        }).unwrap()
            .then(() => {
                dispatch(authActions.setEmail(values.email));
                navigate(getRouteVerifyEmail());
            })
            .catch((error) => {
                if (error.status === 400) {
                    setSubmitError(t("validation_error"));
                } else if (error.status === 409) {
                    navigate(getRouteLogin());
                } else {
                    setSubmitError(t("sign_up_error") + error);
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    }, [dispatch, inviteCode, navigate, signUp, t]);

    const formik = useFormik({
        validationSchema,
        initialValues,
        onSubmit,
    });

    return (
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
                    <div className={cls.error}>{formik.errors.email}</div>
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
                    <div className={cls.error}>{formik.errors.password}</div>
                )}
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    placeholder={t("confirm_password_placeholder")}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className={cls.error}>{formik.errors.confirmPassword}</div>
                )}
                <Input
                    id="tgUsername"
                    name="tgUsername"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.tgUsername}
                    placeholder={t("tg_username_placeholder")}
                />
                {formik.touched.tgUsername && formik.errors.tgUsername && (
                    <div className={cls.error}>{formik.errors.tgUsername}</div>
                )}
                <Button
                    type="submit"
                    disabled={formik.isSubmitting || isSignUpPerforming}
                    role={ButtonRole.PRIMARY}
                >
                    {t("sign_up_btn")}
                </Button>
            </form>
            {submitError && <div className={cls.error}>{submitError}</div>}
            <p>{t("confirm_policy")}</p>
        </DynamicReducersLoader>
    );
});

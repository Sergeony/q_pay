import { FormikHelpers, useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { Trans, useTranslation } from "react-i18next";
import * as yup from "yup";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import {
    memo, useCallback, useEffect, useMemo, useState
} from "react";
import { getRouteLogin, getRouteNotFound, getRouteVerifyEmail } from "shared/const/router";
import { Field, FieldVariant } from "shared/ui/Field/Field";
import CloseEye from "shared/ui/img/svg/CloseEye.svg";
import OpenEye from "shared/ui/img/svg/OpenEye.svg";
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
    password: yup.string().required(),
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

    const passwordRequirements = useMemo(() => (
        {
            [t("password_req_uppercase")]: /[A-Z]/.test(formik.values.password),
            [t("password_req_lowercase")]: /[a-z]/.test(formik.values.password),
            [t("password_req_digits")]: /[0-9]/.test(formik.values.password),
            [t("password_req_long_enough")]: formik.values.password.length >= 12,
        }
    ), [formik.values.password, t]);

    const allPasswordRequirementsMet = useMemo(
        () => Object.values(passwordRequirements).every(Boolean),
        [passwordRequirements]
    );

    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [hideRePassword, setHideRePassword] = useState<boolean>(true);

    return (
        <main className={cls.main}>
            <section aria-labelledby="sign-up-heading" className="v-stack gap-32">
                <h1 id="sign-up-heading" className="PageTitle">
                    {t("sign_up_page_title")}
                </h1>
                <DynamicReducersLoader
                    keepAfterUnmount
                    reducers={reducers}
                >
                    <form
                        onSubmit={formik.handleSubmit}
                        className="v-stack gap-32 w-full"
                    >
                        <Field
                            variant={FieldVariant.SECURE}
                            label={t("email_field_label")}
                            placeholder={t("email_placeholder")}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email ? formik.errors.email : undefined}
                            id="email"
                            name="email"
                            type="email"
                        />
                        <Field
                            variant={FieldVariant.SECURE}
                            label={t("password_field_label")}
                            placeholder={t("password_placeholder")}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && formik.errors.password}
                            id="password"
                            name="password"
                            type={hidePassword ? "password" : "text"}
                            Icon={hidePassword ? CloseEye : OpenEye}
                            onIconClick={() => setHidePassword((prevState) => !prevState)}
                            requirements={passwordRequirements}
                        />
                        <Field
                            variant={FieldVariant.SECURE}
                            label={t("confirm_password_label")}
                            placeholder={t("confirm_password_placeholder")}
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            id="confirmPassword"
                            name="confirmPassword"
                            type={hideRePassword ? "password" : "text"}
                            Icon={hideRePassword ? CloseEye : OpenEye}
                            onIconClick={() => setHideRePassword((prevState) => !prevState)}
                        />
                        <Field
                            variant={FieldVariant.SECURE}
                            label={t("tg_username_label")}
                            placeholder={t("tg_username_placeholder")}
                            value={formik.values.tgUsername}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.tgUsername && formik.errors.tgUsername}
                            id="tgUsername"
                            name="tgUsername"
                            type="text"
                        />
                        <p className={cls.agreement}>
                            <Trans
                                i18nKey="confirm_policy"
                                components={{
                                    link1: <a
                                        target="_blank"
                                        href="/terms-of-service"
                                        title="Terms of Service"
                                    />,
                                    link2: <a
                                        target="_blank"
                                        href="/privacy-policy"
                                        title="Privacy Policy"
                                    />,
                                }}
                            />
                        </p>
                        <Button
                            type="submit"
                            role={ButtonRole.PRIMARY}
                            disabled={
                                formik.isSubmitting
                                || isSignUpPerforming
                                || !formik.isValid
                                || !allPasswordRequirementsMet
                            }
                        >
                            {t("sign_up_btn")}
                        </Button>
                    </form>
                    {submitError && <div className={cls.error}>{submitError}</div>}
                </DynamicReducersLoader>
            </section>
        </main>
    );
});

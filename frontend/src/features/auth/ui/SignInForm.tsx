import {
    memo, useCallback, useState
} from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch";
import { FormikHelpers, useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { getRouteSetupTotp, getRouteVerifyEmail, getRouteVerifyTotp } from "shared/const/router";
import { Field, FieldVariant } from "shared/ui/Field/Field";
import CloseEye from "shared/ui/img/svg/CloseEye.svg";
import OpenEye from "shared/ui/img/svg/OpenEye.svg";
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
        isInitialValid: false,
    });

    const [hidePassword, setHidePassword] = useState<boolean>(true);

    return (
        <main className={cls.main}>
            <section aria-labelledby="sign-in-heading" className="v-stack gap-32">
                <h1 id="sign-in-heading" className="PageTitle">
                    {t("sign_in_page_title")}
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
                        />
                        <Button
                            type="submit"
                            role={ButtonRole.PRIMARY}
                            disabled={
                                formik.isSubmitting
                                || isLoading
                                || !formik.isValid
                            }
                        >
                            {t("sign_in_btn")}
                        </Button>
                    </form>
                </DynamicReducersLoader>
            </section>
        </main>
    );
});

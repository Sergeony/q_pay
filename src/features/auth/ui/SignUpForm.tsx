import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import { memo, useState } from "react";
import { RoutePath } from "shared/config/routeConfig/routeConfig";
import { useSignUpMutation } from "../model/services/authService";
import { authActions, authReducer } from "../model/slice/authSlice";
import cls from "./Auth.module.scss";

const reducers: Reducers = {
    auth: authReducer
};

const useValidationSchema = () => {
    const { t } = useTranslation();

    return yup.object({
        email: yup.string().email(t("invalid_email_address")).required(t("required")),
        password: yup.string().min(8, t("password_too_short")).required(t("required")),
        confirmPassword: yup.string()
            .oneOf([yup.ref("password")], t("password_must_match"))
            .required(t("required")),
        tgUsername: yup.string(),
    });
};

export const SignUpForm = memo(() => {
    const { t } = useTranslation();
    const [agreed, setAgreed] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [signUp, { isLoading }] = useSignUpMutation();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState("");
    const validationSchema = useValidationSchema();
    const location = useLocation();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
            tgUsername: "",
        },
        validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            const queryParams = new URLSearchParams(location.search);
            const inviteCode = queryParams.get("invite-code") || "";

            signUp({
                inviteCode,
                password: values.password,
                email: values.email,
                tgUsername: values.tgUsername,
            }).unwrap()
                .then(() => {
                    dispatch(authActions.setEmail(values.email));
                    navigate(RoutePath.verify_evc);
                })
                .catch((error) => {
                    if (error.status === 400) {
                        setSubmitError(t("validation_error"));
                    } else if (error.status === 409) {
                        navigate(RoutePath.sign_in);
                    } else {
                        setSubmitError(t("sign_up_error") + error);
                    }
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
    });

    return (
        <>
            <div>
                <h2>{t("Регистрация")}</h2>
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
                            placeholder="Email"
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
                            placeholder="Password"
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
                            placeholder="Confrim Password"
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
                            placeholder={t("telegram_username")}
                        />
                        {formik.touched.tgUsername && formik.errors.tgUsername && (
                            <div className={cls.error}>{formik.errors.tgUsername}</div>
                        )}
                        <Button
                            type="submit"
                            disabled={formik.isSubmitting || isLoading}
                            role={ButtonRole.PRIMARY}
                        >
                            {t("sign_up_btn")}
                        </Button>
                    </form>
                    <Input
                        type="checkbox"
                        onChange={() => setAgreed(!agreed)}
                        checked={agreed}
                    />
                    <p>{t("confirm_policy")}</p>
                </DynamicReducersLoader>
            </div>
        </>
    );
});

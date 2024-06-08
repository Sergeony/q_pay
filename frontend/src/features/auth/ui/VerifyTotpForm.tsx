import { memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";
import { jwtDecode } from "jwt-decode";
import { userActions } from "entities/User";
import { Field, FieldVariant } from "shared/ui/Field/Field";
import { getRouteNotFound } from "shared/const/router";
import { useVerifyTotpMutation } from "../api/authService";
import { getAuthTt } from "../model/selectors/getAuthTt";
import cls from "./Auth.module.scss";

const validationSchema = yup.object({
    totp: yup.string().required(),
});

interface FormSchema {
    totp: string;
}

const initialValues: FormSchema = {
    totp: "",
};

interface TokenPayload {
    user_type: number;
    user_id: number;
}

export const VerifyTotpForm = memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const tt = useSelector(getAuthTt);
    const [verifyTotp, { isLoading }] = useVerifyTotpMutation();

    const onSubmit = useCallback((
        values: FormSchema,
        { setSubmitting }: FormikHelpers<FormSchema>
    ) => {
        verifyTotp({
            totp: values.totp,
            tt,
        }).unwrap()
            .then((response) => {
                localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, response.data.access);
                const decodedToken: TokenPayload = jwtDecode(response.data.access);
                dispatch(userActions.setUserData({
                    type: decodedToken.user_type,
                    id: decodedToken.user_id,
                }));
                navigate("/"); // FIXME: navigate to user's home page
            })
            .catch(() => {
                // FIXME: handle errors properly
            })
            .finally(() => {
                setSubmitting(false);
            });
    }, [dispatch, navigate, tt, verifyTotp]);

    const formik = useFormik({
        validationSchema,
        initialValues,
        onSubmit,
        isInitialValid: false,
    });

    useEffect(() => {
        if (!tt) {
            navigate(getRouteNotFound());
        }
    }, [navigate, tt]);

    return (
        <main className={cls.main}>
            <section aria-labelledby="verify-totp-heading" className="v-stack gap-32">
                <h2 id="verify-totp-heading" className="PageTitle">
                    {t("verify_totp_page_title")}
                </h2>
                <form
                    onSubmit={formik.handleSubmit}
                    className="v-stack gap-32 w-full"
                >
                    <Field
                        variant={FieldVariant.SECURE}
                        label={t("totp_label")}
                        placeholder={t("totp_placeholder")}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.totp}
                        error={formik.touched.totp && formik.errors.totp}
                        id="totp"
                        name="totp"
                        type="text"
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
                        {t("verify_totp_btn")}
                    </Button>
                </form>
            </section>
        </main>
    );
});

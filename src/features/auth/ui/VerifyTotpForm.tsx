import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";
import { jwtDecode } from "jwt-decode";
import { userActions } from "entities/User";
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
    id: number;
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
                    id: decodedToken.id,
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
    });

    return (
        <>
            <div>
                <h2>{t("verify_totp_page_title")}</h2>
            </div>
            <div>
                <p>{t("verify_totp_page_description")}</p>
                <form className={cls.VerifyTotpForm} onSubmit={formik.handleSubmit}>
                    <div className="custom-field">
                        <Input
                            id="totp"
                            name="totp"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.totp}
                            placeholder={t("totp_placeholder")}
                        />
                    </div>
                    {formik.touched.totp && formik.errors.totp && (
                        <div className={cls.error}>{formik.errors.totp}</div>
                    )}
                    <Button
                        type="submit"
                        disabled={formik.isSubmitting || isLoading}
                        role={ButtonRole.PRIMARY}
                    >
                        {t("verify_totp_btn")}
                    </Button>
                </form>
            </div>
        </>
    );
});

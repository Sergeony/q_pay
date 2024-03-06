import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { signInFormActions } from "../model/slice/signInFormSlice";
import { getSignInFormState } from "../model/selectors/getSignInFormState";
import cls from "./SignInForm.module.scss";

export const SignInForm = memo(() => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { email, password } = useSelector(getSignInFormState);

    const onEmailChange = useCallback((value: string) => {
        dispatch(signInFormActions.setEmail(value));
    }, [dispatch]);

    const onPasswordChange = useCallback((value: string) => {
        dispatch(signInFormActions.setPassword(value));
    }, [dispatch]);

    const handleSignIn = useCallback(() => {
        // TODO: implement
    }, []);

    return (
        <form className={cls.SignInForm}>
            <Input
                type="email"
                onChange={onEmailChange}
                value={email}
            />
            <Input
                type="password"
                onChange={onPasswordChange}
                value={password}
            />
            <Button
                type="submit"
                onClick={handleSignIn}
                role={ButtonRole.PRIMARY}
            >
                {t("sign_in_btn")}
            </Button>
        </form>
    );
});

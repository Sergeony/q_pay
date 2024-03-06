import { memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { DynamicReducersLoader, Reducers } from "shared/lib/components/DynamicReducersLoader";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch";
import { getSignInFormEmail } from "../model/selectors/getSignInFormEmail";
import { getSignInFormPassword } from "../model/selectors/getSignInFormPassword";
import { signInFormActions, signInFormReducer } from "../model/slice/signInFormSlice";
import cls from "./SignInForm.module.scss";

const reducers: Reducers = {
    signInForm: signInFormReducer
};

interface SignInFormProps {
    onSuccess: () => void;
}

export const SignInForm = memo((props: SignInFormProps) => {
    const {
        onSuccess,
    } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const email = useSelector(getSignInFormEmail);
    const password = useSelector(getSignInFormPassword);

    const onEmailChange = useCallback((value: string) => {
        dispatch(signInFormActions.setEmail(value));
    }, [dispatch]);

    const onPasswordChange = useCallback((value: string) => {
        dispatch(signInFormActions.setPassword(value));
    }, [dispatch]);

    const handleSignIn = useCallback(async () => {
        // await dispatch(signInFormActions.setPassword(password));
        // const result = await dispatch(signInFormActions.setEmail(email));
        // if (result.meta.requestStatus = "fullfilled") {
        //     onSuccess();
        // }
        // TODO: implement
    }, [dispatch, password, email, onSuccess]);

    return (
        <DynamicReducersLoader reducers={reducers}>
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
        </DynamicReducersLoader>
    );
});

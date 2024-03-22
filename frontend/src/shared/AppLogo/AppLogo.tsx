import { memo, useMemo } from "react";
import { getUserData, UserType } from "entities/User";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import cls from "./AppLogo.module.scss";

export const AppLogo = memo(() => {
    const userData = useSelector(getUserData);
    const { t } = useTranslation();

    const userTypeRepr = useMemo(() => {
        if (userData?.type === UserType.TRADER) {
            return "TRADER";
        } if (userData?.type === UserType.MERCHANT) {
            return "MERCHANT";
        } if (userData?.type === UserType.ADMIN) {
            return "ADMIN";
        }
        return "";
    }, [userData?.type]);

    return (
        <div className="h-stack alignCenter">
            <span className={cls.Q}>Q</span>
            <div className="v-stack">
                <span className={cls.Pay}>{t("pay")}</span>
                <span className={cls.UserType}>{userTypeRepr}</span>
            </div>
        </div>
    );
});

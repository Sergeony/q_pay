import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { HStack } from "../Stack";
import cls from "./Logo.module.scss";

const Logo = memo(() => {
    const { t } = useTranslation();

    return (
        <HStack align="center">
            <span className={cls.Q}>Q</span>
            <div>
                <span>{t("pay")}</span>
                <span>{t("CLIENT")}</span>
            </div>
        </HStack>
    );
});

export default Logo;

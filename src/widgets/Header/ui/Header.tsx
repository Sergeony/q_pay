import React, { memo } from "react";
import { HStack } from "shared/ui/Stack";
import { ThemeToggle } from "features/ThemeToggle";
import { LangSelect } from "features/LangSelect";
import { useTranslation } from "react-i18next";
import cls from "./Header.module.scss";

interface IProps {
    className?: string;
}

export const Header = memo(({ className }: IProps) => {
    // const dispatch = useDispatch();
    const { t } = useTranslation();

    return (
        <HStack className={cls.Header} justify="center" As="header">
            <div className={cls.Content}>
                <div>{t("logo")}</div>
                <ThemeToggle className={cls.ThemeToggle} />
                <HStack>
                    <div>{t("notif")}</div>
                    <LangSelect />
                </HStack>
            </div>
        </HStack>
    );
});

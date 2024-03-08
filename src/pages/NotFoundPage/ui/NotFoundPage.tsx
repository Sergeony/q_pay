import { memo } from "react";

import { useTranslation } from "react-i18next";
import { VStack } from "shared/ui/Stack";
import cls from "./NotFoundPage.module.scss";

export const NotFoundPage = memo(() => {
    const { t } = useTranslation();

    return (
        <VStack className={cls.NotFoundPage}>
            <p>{t("page_not_found")}</p>
        </VStack>
    );
});

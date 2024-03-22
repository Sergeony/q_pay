import { memo } from "react";

import { useTranslation } from "react-i18next";
import { VStack } from "shared/ui/Stack";
import cls from "./NotFoundPage.module.scss";

const NotFoundPage = memo(() => {
    const { t } = useTranslation();

    return (
        <VStack className={cls.NotFoundPage}>
            <p>{t("page_not_found_text")}</p>
        </VStack>
    );
});

export default NotFoundPage;

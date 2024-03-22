import { useTranslation } from "react-i18next";
import { memo } from "react";
import { VStack } from "shared/ui/Stack";
import cls from "./ForbiddenPage.module.scss";

const ForbiddenPage = memo(() => {
    const { t } = useTranslation();

    return (
        <VStack className={cls.ForbiddenPage}>
            <p>{t("forbidden_page_text")}</p>
        </VStack>
    );
});

export default ForbiddenPage;

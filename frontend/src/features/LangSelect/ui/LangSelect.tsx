import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import DropDown from "shared/ui/DropDown/DropDown";

export const LangSelect = memo(() => {
    const { t, i18n } = useTranslation();

    const handleSelect = useCallback(async (newLang: string) => {
        await i18n.changeLanguage(newLang);
    }, [i18n]);

    return (
        <DropDown<string>
            value={i18n.language}
            onChange={handleSelect}
            data-testid="lang-select"
            options={[
                { value: "en", content: t("Eng") },
                { value: "uk", content: t("Укр") },
                { value: "ru", content: t("Рус") },
            ]}
            label={t("lang_select_label")}
            hideLabel
        />
    );
});

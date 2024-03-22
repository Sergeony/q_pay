import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

export const LangSelect = memo(() => {
    const [lang, setLang] = useState<string>("en");
    const { t, i18n } = useTranslation();

    const handleSelect = async (e: any) => {
        const newLang = e.target.value;
        setLang(newLang);
        await i18n.changeLanguage(newLang);
    };

    return (
        <select
            data-testid="lang-select"
            value={lang}
            onChange={handleSelect}
        >
            <option value="en">{t("English")}</option>
            <option value="uk">{t("УкраЇнська")}</option>
            <option value="ru">{t("Русский")}</option>
        </select>
    );
});

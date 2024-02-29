import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

export const LangSelect: FC = () => {
    const [lang, setLang] = useState<string>("ru");
    const { t, i18n } = useTranslation();

    const handleSelect = async (e: any) => {
        const newLang = e.target.value;
        setLang(newLang);
        await i18n.changeLanguage(newLang);
    };

    return (
        <select
            value={lang}
            onChange={handleSelect}
        >
            <option value="en">{t("English")}</option>
            <option value="uk">{t("УкраЇнська")}</option>
            <option value="ru">{t("Русский")}</option>
        </select>
    );
};

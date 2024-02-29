import { classNames } from "shared/lib/classNames/classNames";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useTranslation } from "react-i18next";

interface MainPageProps {
    className?: string;
}

export const MainPage = ({ className }: MainPageProps) => {
    const { t } = useTranslation();

    return (
        <div className={classNames("", {}, [className])}>
            <Button role={ButtonRole.PRIMARY}>{t("Hello!")}</Button>
        </div>
    );
};

import {
    TransactionStatusGroup,
    TransactionTypeRepr
} from "entities/Transaction";
import { getRoutePay } from "shared/const/router";
import { useTranslation } from "react-i18next";
import { AppNavLink } from "shared/ui/AppNavLink/AppNavLink";

interface NavBarProps {
    type: TransactionTypeRepr;
}

export const NavBar = (props: NavBarProps) => {
    const { t } = useTranslation();
    const { type } = props;

    return (
        <nav className="h-stack gap-32">
            <AppNavLink
                variant="tab"
                to={getRoutePay(type, TransactionStatusGroup.ACTIVE)}
                title={t("Активные")}
            >
                {t("Активные")}
            </AppNavLink>
            <AppNavLink
                variant="tab"
                to={getRoutePay(type!, TransactionStatusGroup.COMPLETED)}
                title={t("Завершенные")}
            >
                {t("Завершенные")}
            </AppNavLink>
            <AppNavLink
                variant="tab"
                to={getRoutePay(type!, TransactionStatusGroup.DISPUTED)}
                title={t("Споры")}
            >
                {t("Споры")}
            </AppNavLink>
            <AppNavLink
                variant="tab"
                to={getRoutePay(type!, "export")}
                title={t("Экспорт")}
            >
                {t("Экспорт")}
            </AppNavLink>
        </nav>
    );
};

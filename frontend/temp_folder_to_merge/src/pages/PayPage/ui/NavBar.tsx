import {
    TransactionStatusGroup,
    TransactionTypeRepr
} from "entities/Transaction";
import { getRoutePay } from "shared/const/router";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import cls from "./PayPage.module.scss";

interface NavBarProps {
    type: TransactionTypeRepr;
}

export const NavBar = (props: NavBarProps) => {
    const { t } = useTranslation();
    const { type } = props;

    return (
        <nav className="h-stack gap-32">
            <NavLink
                to={getRoutePay(type, TransactionStatusGroup.ACTIVE)}
                className={({ isActive }) => `${cls.Link} ${isActive && cls.active}`}
            >
                {t("Активные")}
            </NavLink>
            <NavLink
                to={getRoutePay(type!, TransactionStatusGroup.COMPLETED)}
                className={({ isActive }) => `${cls.Link} ${isActive && cls.active}`}
            >
                {t("Завершенные")}
            </NavLink>
            <NavLink
                to={getRoutePay(type!, TransactionStatusGroup.DISPUTED)}
                className={({ isActive }) => `${cls.Link} ${isActive && cls.active}`}
            >
                {t("Споры")}
            </NavLink>
            <NavLink
                to={getRoutePay(type!, "export")}
                className={({ isActive }) => `${cls.Link} ${isActive && cls.active}`}
            >
                {t("Экспорт")}
            </NavLink>
        </nav>
    );
};

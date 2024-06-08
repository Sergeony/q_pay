import { memo, ReactNode, useCallback } from "react";
import { NavLink, NavLinkProps, useLocation } from "react-router-dom";
import cls from "./AppNavLink.module.scss";

type AppLinkVariant = "header" | "tab" | "page";

interface AppNavLinkProps extends NavLinkProps {
    children: ReactNode | string;
    variant?: AppLinkVariant;
    match?: string;
}

export const AppNavLink = memo((props: AppNavLinkProps) => {
    const {
        to,
        children,
        variant,
        match,
        ...otherProps
    } = props;
    const location = useLocation();

    const getIsActive = useCallback(
        (match: string) => location.pathname.includes(match),
        [location.pathname]
    );

    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
                ${variant && cls[variant]}
                ${(match ? getIsActive(match) : isActive) && cls.isActive}
            `}
            {...otherProps}
        >
            {children}
        </NavLink>
    );
});

import { LinkProps as NavLinkProps, NavLink } from "react-router-dom";
import { memo, ReactNode } from "react";
import { classNames } from "shared/lib/classNames/classNames";
import cls from "./Link.module.scss";

export type LinkVariant = "primary" | "red";

interface LinkProps extends NavLinkProps {
    className?: string;
    variant?: LinkVariant;
    children?: ReactNode;
    activeClassName?: string;
}

export const Link = memo((props: LinkProps) => {
    const {
        to,
        className,
        children,
        variant = "primary",
        activeClassName = "",
        ...otherProps
    } = props;

    return (
        <NavLink
            to={to}
            className={({ isActive }) => classNames(
                cls.Link,
                [className, cls[variant]],
                { [activeClassName]: isActive }
            )}
            {...otherProps}
        >
            {children}
        </NavLink>
    );
});

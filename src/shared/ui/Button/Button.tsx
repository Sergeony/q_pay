import { ButtonHTMLAttributes, memo, ReactNode } from "react";

import { classNames } from "shared/lib/classNames/classNames";
import cls from "./Button.module.scss";

export enum ButtonRole {
    PRIMARY = "primary",
    CANCEL = "cancel",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    role?: ButtonRole;
    width?: string;
    className?: string;
}

export const Button = memo((props: ButtonProps) => {
    const {
        children,
        role,
        width,
        className,
        ...otherProps
    } = props;

    return (
        <button
            type="button"
            style={{ width }}
            className={classNames(cls.Button, [cls[role], className])}
            {...otherProps}
        >
            {children}
        </button>
    );
});

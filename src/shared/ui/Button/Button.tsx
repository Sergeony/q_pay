import { ButtonHTMLAttributes, ReactNode, FC } from "react";

import { classNames } from "shared/lib/classNames/classNames";
import cls from "./Button.module.scss";

export enum ButtonRole {
    PRIMARY = "primary",
    BACK = "back",
    CANCEL = "cancel",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    role?: ButtonRole;
    children: ReactNode;
    className?: string;
}

export const Button: FC<ButtonProps> = (props) => {
    const {
        role,
        children,
        className,
        ...otherProps
    } = props;

    return (
        <button
            type="submit"
            className={classNames(cls.Button, {}, [cls[role], className])}
            {...otherProps}
        >
            {children}
        </button>
    );
};

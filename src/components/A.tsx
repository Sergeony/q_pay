import React from 'react';

import cls from "./A.module.scss";
import { classNames } from "shared/lib/classNames/classNames";


export enum ATheme {
    PRIMARY = "primary",
    SECONDARY = "secondary",
}

interface AProps {
    className?: string;
    theme?: ATheme;
}


export const A = ({className, theme = ATheme.PRIMARY}: AProps) => {
    return (
        <div className={classNames(cls.A, {}, [className, cls[theme]])}>
            Hello!
        </div>
    );
};

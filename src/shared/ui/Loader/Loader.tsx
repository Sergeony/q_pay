import { FC } from "react";

import cls from "./Loader.module.scss";

export enum LoaderRole {
    PAGE = "page",
}

interface LoaderProps {
    role?: LoaderRole;
}

export const Loader: FC<LoaderProps> = (props) => {
    const { role } = props;

    return (
        <div className={cls[role]}>
            <span className={cls.Loader} />
        </div>
    );
};

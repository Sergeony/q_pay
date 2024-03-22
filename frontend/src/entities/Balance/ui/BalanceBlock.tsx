import { memo } from "react";
import { classNames } from "shared/lib/classNames/classNames";
import { TetherIcon } from "shared/ui/_SVG";
import SnowFlakeIcon from "shared/ui/_SVG/icons/SnowFlakeIcon";
import { useSelector } from "react-redux";
import cls from "./BalanceBlock.module.scss";
import { getBalance } from "../model/selectors/getBalance";

export const BalanceBlock = memo(() => {
    const balance = useSelector(getBalance);
    return (
        <div className={classNames(cls.BalanceWrapper)}>
            <div className="h-stack gap-4 alignCenter justifyEnd">
                <span>{balance?.activeBalance}</span>
                <TetherIcon />
            </div>
            <div className="h-stack gap-4 alignCenter justifyEnd">
                <span>{balance?.frozenBalance}</span>
                <SnowFlakeIcon useGradient />
            </div>
        </div>
    );
});

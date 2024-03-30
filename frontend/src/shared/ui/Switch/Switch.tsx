import React, {
    InputHTMLAttributes, memo, useMemo
} from "react";
import { classNames } from "shared/lib/classNames/classNames";
import { Button, ButtonRole } from "../Button/Button";
import cls from "./Switch.module.scss";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
    isLarge?: boolean;
    isActive: boolean;
    onSwitch?: () => void;
}

const Switch = memo((props: IProps) => {
    const {
        isLarge = false,
        isActive,
        onSwitch,
    } = props;

    const modes = useMemo(() => ({
        [cls.isLarge]: isLarge,
        [cls.isActive]: isActive,
    }), [isActive, isLarge]);

    return (
        <Button
            role={ButtonRole.CLEAR}
            onClick={onSwitch}
            className={classNames(cls.Switch, [], modes)}
            aria-pressed={isActive}
        >
            <span className={cls.ToggleSpan} />
        </Button>
    );
});

export default Switch;

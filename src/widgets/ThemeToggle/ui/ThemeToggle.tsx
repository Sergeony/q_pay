import { memo } from "react";
import { MoonIcon, SunIcon } from "shared/ui/_SVG";
import { classNames } from "shared/lib/classNames/classNames";
import { Button } from "shared/ui/Button/Button";
import cls from "./ThemeToggle.module.scss";
import { useTheme } from "../lib/useTheme";
import { Theme } from "../lib/ThemeContext";

export const ThemeToggle = memo(() => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            className={cls.ThemeToggle}
            onClick={toggleTheme}
        >
            <div
                className={classNames(
                    cls.ToggleCircle,
                    [],
                    { [cls.active]: theme === Theme.LIGHT }
                )}
            >
                <SunIcon />
            </div>
            <div
                className={classNames(
                    cls.ToggleCircle,
                    [],
                    { [cls.active]: theme === Theme.DARK }
                )}
            >
                <MoonIcon />
            </div>
        </Button>
    );
});

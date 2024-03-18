import { memo } from "react";
import { MoonIcon, SunIcon } from "shared/ui/_SVG";
import { classNames } from "shared/lib/classNames/classNames";
import { Button } from "shared/ui/Button/Button";
import { HStack } from "shared/ui/Stack";
import cls from "./ThemeToggle.module.scss";
import { useTheme } from "../lib/useTheme";
import { Theme } from "../lib/ThemeContext";

interface ThemeToggleProps {
    className?: string;
}

export const ThemeToggle = memo((props: ThemeToggleProps) => {
    const { className } = props;
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            className={classNames(cls.ThemeToggle, [className], {})}
            onClick={toggleTheme}
        >
            <HStack
                className={classNames(
                    cls.ToggleCircle,
                    [],
                    { [cls.active]: theme === Theme.LIGHT }
                )}
            >
                <SunIcon />
            </HStack>
            <HStack
                className={classNames(
                    cls.ToggleCircle,
                    [],
                    { [cls.active]: theme === Theme.DARK }
                )}
            >
                <MoonIcon />
            </HStack>
        </Button>
    );
});

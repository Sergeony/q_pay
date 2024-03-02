import { Theme } from "widgets/ThemeToggle/lib/ThemeContext";
import { Decorator } from "@storybook/react";

export const ThemeDecorator = (theme: Theme): Decorator => (Story) => (
    <div className={`app ${theme}`}>
        <Story />
    </div>
);

import { Decorator } from "@storybook/react";

export const ThemeDecorator = (): Decorator => (Story, context) => {
    const { globals } = context;
    const { theme } = globals;

    return (
        <div className={`app ${theme}`}>
            <Story />
        </div>
    );
};

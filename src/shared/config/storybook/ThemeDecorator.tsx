import { Decorator } from "@storybook/react";
import { ReactNode, useEffect } from "react";
import { Theme } from "widgets/ThemeToggle/lib/ThemeContext";

interface ThemeProviderProps {
    theme: Theme;
    children: ReactNode;
}

const ThemeProvider = (props: ThemeProviderProps) => {
    const {
        theme,
        children,
    } = props;

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return children;
};

export const ThemeDecorator: Decorator = (Story, context) => {
    const { globals } = context;
    const { theme } = globals;

    return (
        <ThemeProvider theme={theme}>
            <div id="app" className="app">
                <Story />
            </div>
        </ThemeProvider>
    );
};

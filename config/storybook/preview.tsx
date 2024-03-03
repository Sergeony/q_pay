import type { Preview } from "@storybook/react";
import "../../src/app/styles/index.scss";
import { StyleDecorator } from "../../src/shared/config/storybook/StyleDecorator";
import { ThemeDecorator } from "../../src/shared/config/storybook/ThemeDecorator";
import { RouterDecorator } from "../../src/shared/config/storybook/RouterDecorator";
import { TranslationsDecorator } from "../../src/shared/config/storybook/TranslationsDecorator";
import { Theme } from "../../src/widgets/ThemeToggle/lib/ThemeContext";

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        StyleDecorator(),
        RouterDecorator(),
        ThemeDecorator(),
        TranslationsDecorator(),
    ],
    globalTypes: {
        locale: {
            description: "Internationalization locale",
            defaultValue: "en",
            toolbar: {
                dynamicTitle: true,
                icon: "globe",
                items: [
                    { value: "en", title: "English" },
                    { value: "uk", title: "Ukrainian" },
                    { value: "ru", title: "Russian" },
                ],
            },
        },
        theme: {
            description: "Global theme for components",
            defaultValue: Theme.LIGHT,
            toolbar: {
                dynamicTitle: true,
                icon: "mirror",
                items: [
                    { value: "light", title: "Light" },
                    { value: "dark", title: "Dark" },
                ],
            },
        },
    },
};

export default preview;

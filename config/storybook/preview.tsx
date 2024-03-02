import type { Preview } from "@storybook/react";
import "../../src/app/styles/index.scss";
import { StyleDecorator } from "../../src/shared/config/storybook/StyleDecorator";
import { ThemeDecorator } from "../../src/shared/config/storybook/ThemeDecorator";
import { RouterDecorator } from "../../src/shared/config/storybook/RouterDecorator";
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
        ThemeDecorator(Theme.LIGHT),
        RouterDecorator(),
    ]
};

export default preview;

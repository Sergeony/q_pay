import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "shared/config/storybook/ThemeDecorator";
import { Theme } from "widgets/ThemeToggle/lib/ThemeContext";
import { NotFoundPage } from "./NotFoundPage";

const meta: Meta<typeof NotFoundPage> = {
    title: "pages/NotFoundPage",
    component: NotFoundPage,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NotFoundPage>;

export const NotFoundPageLight: Story = {};

export const NotFoundPageDark: Story = {
    decorators: [
        ThemeDecorator(Theme.DARK),
    ]
};

import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "shared/config/storybook/ThemeDecorator";
import { Theme } from "widgets/ThemeToggle/lib/ThemeContext";
import { LangSelect } from "./LangSelect";

const meta: Meta<typeof LangSelect> = {
    title: "widgets/LangSelect",
    component: LangSelect,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LangSelect>;

export const LangSelectLight: Story = {};

export const LangSelectDark: Story = {
    decorators: [
        ThemeDecorator(Theme.DARK),
    ]
};

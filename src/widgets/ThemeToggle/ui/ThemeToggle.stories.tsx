import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "shared/config/storybook/ThemeDecorator";
import { Theme } from "widgets/ThemeToggle/lib/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
    title: "widgets/ThemeToggle",
    component: ThemeToggle,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const ThemeToggleLight: Story = {};

export const ThemeToggleDark: Story = {
    decorators: [
        ThemeDecorator(Theme.DARK),
    ]
};

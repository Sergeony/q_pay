import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "shared/config/storybook/ThemeDecorator";
import { Theme } from "widgets/ThemeToggle/lib/ThemeContext";
import { Button, ButtonRole } from "./Button";

const meta: Meta<typeof Button> = {
    title: "shared/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimaryLight: Story = {
    args: {
        children: "Primary Light Btn",
        role: ButtonRole.PRIMARY,
        width: "200px",
    },
};

export const PrimaryDark: Story = {
    args: {
        children: "Primary Dark Btn",
        role: ButtonRole.PRIMARY,
        width: "200px",
    },
    decorators: [
        ThemeDecorator(Theme.DARK),
    ]
};

export const BackLight: Story = {
    args: {
        children: "Back Btn",
        role: ButtonRole.BACK,
    },
};

export const BackDark: Story = {
    args: {
        children: "Back Btn",
        role: ButtonRole.BACK,
    },
    decorators: [
        ThemeDecorator(Theme.DARK),
    ]
};

export const Cancel: Story = {
    args: {
        children: "Cancel Btn",
        role: ButtonRole.CANCEL,
    },
};

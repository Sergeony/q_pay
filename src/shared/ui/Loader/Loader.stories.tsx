import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "shared/config/storybook/ThemeDecorator";
import { Theme } from "widgets/ThemeToggle/lib/ThemeContext";
import { Loader, LoaderRole } from "./Loader";

const meta: Meta<typeof Loader> = {
    title: "shared/Loader",
    component: Loader,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const PageLoaderLight: Story = {
    args: {
        role: LoaderRole.PAGE,
    }
};

export const PageLoaderDark: Story = {
    args: {
        role: LoaderRole.PAGE,
    },
    decorators: [
        ThemeDecorator(Theme.DARK),
    ]
};

export const LoaderLight: Story = {};

export const LoaderDark: Story = {
    decorators: [
        ThemeDecorator(Theme.DARK),
    ]
};

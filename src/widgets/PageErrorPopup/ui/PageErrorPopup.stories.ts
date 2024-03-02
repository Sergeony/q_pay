import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "shared/config/storybook/ThemeDecorator";
import { Theme } from "widgets/ThemeToggle/lib/ThemeContext";
import { PageErrorPopup } from "./PageErrorPopup";

const meta: Meta<typeof PageErrorPopup> = {
    title: "widgets/PageErrorPopup",
    component: PageErrorPopup,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageErrorPopup>;

export const PageErrorPopupLight: Story = {};

export const PageErrorPopupDark: Story = {
    decorators: [
        ThemeDecorator(Theme.DARK),
    ]
};

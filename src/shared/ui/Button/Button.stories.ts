import type { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonRole } from "./Button";

const meta: Meta<typeof Button> = {
    title: "shared/Button",
    component: Button,
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: "Primary Btn",
        role: ButtonRole.PRIMARY,
        width: "200px",
    },
};

export const Cancel: Story = {
    args: {
        children: "Cancel Btn",
        role: ButtonRole.CANCEL,
    },
};

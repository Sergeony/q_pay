import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
    title: "widgets/ThemeToggle",
    component: ThemeToggle,
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ThemeToggle>;

export const Basic: Story = {};
// FIXME: bg is applied before Button _styles what is incorrect

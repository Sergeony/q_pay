import type { Meta, StoryObj } from "@storybook/react";
import { LangSelect } from "./LangSelect";

const meta: Meta<typeof LangSelect> = {
    title: "widgets/LangSelect",
    component: LangSelect,
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof LangSelect>;

export const Basic: Story = {};

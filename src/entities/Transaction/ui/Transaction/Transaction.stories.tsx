import type { Meta, StoryObj } from "@storybook/react";

import { Transaction } from "./Transaction";

const meta: Meta<typeof Transaction> = {
    title: "entities/Transaction",
    component: Transaction,
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Transaction>;

export const Basic: Story = {};


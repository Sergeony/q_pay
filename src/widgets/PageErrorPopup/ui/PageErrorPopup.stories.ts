import type { Meta, StoryObj } from "@storybook/react";
import { PageErrorPopup } from "./PageErrorPopup";

const meta: Meta<typeof PageErrorPopup> = {
    title: "widgets/PageErrorPopup",
    component: PageErrorPopup,
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof PageErrorPopup>;

export const Basic: Story = {};

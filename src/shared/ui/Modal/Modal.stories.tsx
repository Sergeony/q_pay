import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
    title: "shared/Modal",
    component: Modal,
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
    args: {
        children: (
            <div>
                Empty modal...
            </div>
        ),
        isOpen: true,
    },
};

export const WithoutCloseBtn: Story = {
    args: {
        children: (
            <div>
                Modal without close button...
            </div>
        ),
        isOpen: true,
        hasCloseBtn: false,
    },
};

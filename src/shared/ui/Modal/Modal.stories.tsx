import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "shared/config/storybook/ThemeDecorator";
import { Theme } from "widgets/ThemeToggle/lib/ThemeContext";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
    title: "shared/Modal",
    component: Modal,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const ModalLight: Story = {
    args: {
        children: (
            <div style={{ width: "100px", height: "100px" }}>
                Empty light modal...
            </div>
        )
    }
};

export const ModalDark: Story = {
    args: {
        children: (
            <div style={{ width: "100px", height: "100px" }}>
                Empty dark modal...
            </div>
        )
    },
    decorators: [
        ThemeDecorator(Theme.DARK),
    ]
};

export const ModalWithoutCloseBtnLight: Story = {
    args: {
        children: (
            <div style={{ width: "100px", height: "100px" }}>
                Light modal without close button...
            </div>
        ),
        hideClose: true,
    },
};

export const ModalWithoutCloseBtnDark: Story = {
    args: {
        children: (
            <div style={{ width: "100px", height: "100px" }}>
                Dark modal without close button...
            </div>
        ),
        hideClose: true,
    },
    decorators: [
        ThemeDecorator(Theme.DARK),
    ]
};

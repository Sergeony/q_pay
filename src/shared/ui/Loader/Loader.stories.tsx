import type { Meta, StoryObj } from "@storybook/react";
import { Loader, LoaderRole } from "./Loader";

const meta: Meta<typeof Loader> = {
    title: "shared/Loader",
    component: Loader,
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Loader>;

export const Basic: Story = {};

export const Page: Story = {
    args: {
        role: LoaderRole.PAGE,
    },
};

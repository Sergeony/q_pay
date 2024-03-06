import { Decorator } from "@storybook/react";
import { StateSchema, StoreProvider } from "app/providers/StoreProvider";

export const StoreDecorator = (state: Partial<StateSchema>): Decorator => (Story) => (
    <StoreProvider initialState={state}>
        <Story />
    </StoreProvider>
);

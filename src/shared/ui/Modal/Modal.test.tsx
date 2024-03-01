import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
    const children = (<div />);

    test("Test render", () => {
        render(<Modal>{children}</Modal>);
        expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    test("Test render close button", () => {
        render(<Modal>{children}</Modal>);
        expect(screen.queryByTestId("close-button")).toBeInTheDocument();
    });

    test("Test don't render close button", () => {
        render(<Modal hideClose>{children}</Modal>);
        expect(screen.queryByTestId("close-button")).not.toBeInTheDocument();
    });
});

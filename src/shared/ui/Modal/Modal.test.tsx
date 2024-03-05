import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
    const children = (<div />);

    test("Test render", () => {
        render(<Modal isOpen>{children}</Modal>);
        expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    test("Test render close button", () => {
        render(<Modal isOpen>{children}</Modal>);
        expect(screen.queryByTestId("close-button")).toBeInTheDocument();
    });

    test("Test don't render close button", () => {
        render(<Modal isOpen hasCloseBtn={false}>{children}</Modal>);
        expect(screen.queryByTestId("close-button")).not.toBeInTheDocument();
    });
});

import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
    const children = (<div />);

    test("Test render", () => {
        render(<div id="app"><Modal isLazy isOpen>{children}</Modal></div>);
        expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    test("Test render close button", () => {
        render(<div id="app"><Modal isLazy isOpen>{children}</Modal></div>);
        expect(screen.queryByTestId("close-button")).toBeInTheDocument();
    });

    test("Test don't render close button", () => {
        render(<div id="app"><Modal isLazy isOpen hasCloseBtn={false}>{children}</Modal></div>);
        expect(screen.queryByTestId("close-button")).not.toBeInTheDocument();
    });
});

import { render, screen } from "@testing-library/react";
import { Button, ButtonRole } from "./Button";

describe("Button", () => {
    test("Test render", () => {
        render(<Button>Test button</Button>);
        expect(screen.getByText("Test button")).toBeInTheDocument();
    });

    test("Test role", () => {
        const roleClass = ButtonRole.PRIMARY;
        render(<Button role={roleClass}>Test button</Button>);
        expect(screen.getByText("Test button")).toHaveClass(roleClass);
    });
});

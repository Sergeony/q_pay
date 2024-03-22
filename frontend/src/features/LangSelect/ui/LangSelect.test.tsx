import { screen } from "@testing-library/react";
import { renderComponent } from "shared/lib/tests/renderComponent";
import { LangSelect } from "./LangSelect";

describe("LangSelect", () => {
    test("Test render with the current selected language", () => {
        renderComponent(<LangSelect />);
        const select = screen.queryByTestId("lang-select") as HTMLSelectElement;
        expect(select.value).toBe("en");
    });
});

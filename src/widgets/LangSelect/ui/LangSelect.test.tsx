import { screen } from "@testing-library/react";
import { renderWithTranslations } from "shared/lib/tests/renderWithTranslations";
import { LangSelect } from "./LangSelect";

describe("LangSelect", () => {
    test("Test render with the current selected language", () => {
        renderWithTranslations(<LangSelect />);
        const select = screen.getByTestId("lang-select") as HTMLSelectElement;
        expect(select.value).toBe("ru");
    });
});

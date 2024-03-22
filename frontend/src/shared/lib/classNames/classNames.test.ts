import { classNames } from "./classNames";

describe("classNames", () => {
    test("Test only cls param passed", () => {
        expect(classNames("testClass")).toBe("testClass");
    });

    test("Test cls and modes params passed", () => {
        expect(
            classNames(
                "testClass",
                [],
                { active: true, large: false },
            )
        ).toBe("testClass active");
    });

    test("Test all the params passed", () => {
        expect(
            classNames(
                "testClass",
                ["role"],
                { active: true, large: false }
            )
        ).toBe("testClass role active");
    });
});

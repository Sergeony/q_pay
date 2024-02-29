import { classNames } from "./classNames";

describe("classNames", () => {
    test("only cls arg passed", () => {
        expect(classNames("testClass")).toBe("testClass");
    });

    test("only cls and modes args passed", () => {
        expect(classNames(
            "testClass",
            [],
            { active: true, large: false },
        )).toBe("testClass active");
    });
    test("all the args passed", () => {
        expect(classNames(
            "testClass",
            ["role"],
            { active: true, large: false }
        )).toBe("testClass role active");
    });
});

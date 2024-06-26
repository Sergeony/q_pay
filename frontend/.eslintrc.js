module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
    },
    extends: [
        "plugin:react/recommended",
        "airbnb",
        "plugin:i18next/recommended",
        "plugin:storybook/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: [
        "react",
        "@typescript-eslint",
        "i18next",
        "react-hooks",
        "sergeony-plugin",
    ],
    rules: {
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        indent: ["error", 4],
        "@typescript-eslint/indent": ["error", 4],
        "react/jsx-filename-extension": [
            "error",
            { extensions: [".js", ".jsx", ".tsx"] }
        ],
        "import/no-unresolved": "off",
        "import/prefer-default-export": "off",
        "no-unused-vars": "off",
        "react/require-default-props": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-props-no-spreading": "off",
        "react/function-component-definition": "off",
        "no-shadow": "off",
        "import/extensions": "off",
        "import/no-extraneous-dependencies": "off",
        "no-underscore-dangle": "off",
        "i18next/no-literal-string": "error",
        "max-len": ["warn", { ignoreComments: true, code: 100 }],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
        "no-param-reassign": "off",
        // "react/no-array-index-key": "off",
        "no-undef": "off",
        "sergeony-plugin/path-checker": ["error", { alias: "@" }],
        "sergeony-plugin/public-api-imports": ["error", { alias: "@" }],

        quotes: ["error", "double"],
        "@typescript-eslint/quotes": ["error", "double"],
        "@typescript-eslint/comma-dangle": "off",
        "comma-dangle": "off",
        "jsx-a11y/control-has-associated-label": "off",
    },
    globals: {
        __IS_DEV__: "readonly",
        __API_URL__: "readonly",
    },
    overrides: [
        {
            files: ["**/src/**/*.test.{ts,tsx}"],
            rules: {
                "i18next/no-literal-string": "off",
            },
        },
        {
            files: ["**/src/**/*Icon*.tsx"],
            rules: {
                "max-len": "off",
            }
        }
    ],
};

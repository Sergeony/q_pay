import { Decorator } from "@storybook/react";
import { Suspense, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "shared/config/i18n/i18n";

export const TranslationsDecorator = (): Decorator => (Story, context) => {
    const { globals } = context;
    const { locale } = globals;

    useEffect(() => {
        i18n.changeLanguage(locale).catch(() => {});
    }, [locale]);

    return (
        <Suspense fallback="">
            <I18nextProvider i18n={i18n}>
                <Story />
            </I18nextProvider>
        </Suspense>
    );
};

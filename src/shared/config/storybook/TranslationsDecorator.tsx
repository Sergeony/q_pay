import { Decorator } from "@storybook/react";
import { ReactNode, Suspense, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/i18n";

interface TranslationProviderProps {
    locale: string;
    children: ReactNode;
}

const TranslationProvider = (props: TranslationProviderProps) => {
    const {
        locale,
        children
    } = props;

    useEffect(() => {
        i18n.changeLanguage(locale).catch();
    }, [locale]);

    return (
        <Suspense fallback="">
            <I18nextProvider i18n={i18n}>
                {children}
            </I18nextProvider>
        </Suspense>
    );
};

export const TranslationsDecorator: Decorator = (Story, context) => {
    const { globals } = context;
    const { locale } = globals;

    return (
        <TranslationProvider locale={locale}>
            <Story />
        </TranslationProvider>
    );
};

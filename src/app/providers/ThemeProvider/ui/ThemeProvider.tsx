import {
    FC, PropsWithChildren, useMemo, useState
} from "react";

import { Theme, LOCAL_STORAGE_THEME_KEY, ThemeContext } from "widgets/ThemeToggle/lib/ThemeContext";

const defaultTheme = Theme.LIGHT;
const initialTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme || defaultTheme;

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    const toggleTheme = () => {
        const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
        setTheme(newTheme);
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
    };

    const defaultProps = useMemo(() => ({
        theme,
        setTheme: toggleTheme,
    }), [theme]);

    return (
        <ThemeContext.Provider value={defaultProps}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;

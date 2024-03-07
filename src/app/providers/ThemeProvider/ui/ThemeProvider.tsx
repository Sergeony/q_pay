import {
    FC, PropsWithChildren, useMemo, useState
} from "react";
import { Theme, ThemeContext } from "widgets/ThemeToggle/lib/ThemeContext";
import { LOCAL_STORAGE_THEME_KEY } from "shared/const/localStorage";

const storedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme;
const defaultTheme = Theme.LIGHT;
const initialTheme = storedTheme || defaultTheme;

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    const defaultProps = useMemo(() => ({
        theme,
        setTheme,
    }), [theme]);

    document.body.className = theme; //  FIXME: take it out

    return (
        <ThemeContext.Provider value={defaultProps}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;

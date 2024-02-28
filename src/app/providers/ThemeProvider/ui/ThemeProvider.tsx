import { FC, PropsWithChildren, useMemo, useState } from 'react';

import { Theme, LOCAL_STORAGE_THEME_KEY, ThemeContext } from "../lib/ThemeContext";


const defaultTheme = Theme.LIGHT;
const initialTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme || defaultTheme;


const ThemeProvider: FC<PropsWithChildren> = ({children}) => {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    const toggleTheme = () => {
      setTheme(theme == Theme.DARK ? Theme.LIGHT : Theme.DARK);
    };

    const defaultProps = useMemo(() => ({
        theme: theme,
        setTheme: toggleTheme,
    }), [theme]);

    return (
        <ThemeContext.Provider value={defaultProps}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;

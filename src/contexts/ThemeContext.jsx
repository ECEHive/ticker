import { getStorageItem, setStorageItem } from "@/utils/storage";
import { createContext, useCallback, useState } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [colorTheme, setColorTheme] = useState(() => getStorageItem("color-theme", "dark"));

    const toggleColorTheme = useCallback(() => {
        setColorTheme((prev) => {
            const next = prev === "light" ? "dark" : "light";
            setStorageItem("color-theme", next);
            return next;
        });
    }, []);

    return <ThemeContext.Provider value={{ colorTheme, toggleColorTheme }}>{children}</ThemeContext.Provider>;
}

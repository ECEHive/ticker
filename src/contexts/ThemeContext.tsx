import type { ColorTheme, ThemeContextValue } from "@/types";
import { getStorageItem, setStorageItem } from "@/utils/storage";
import { createContext, type ReactNode, useCallback, useState } from "react";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [colorTheme, setColorTheme] = useState<ColorTheme>(() => getStorageItem<ColorTheme>("color-theme", "dark"));

    const toggleColorTheme = useCallback(() => {
        setColorTheme((prev) => {
            const next: ColorTheme = prev === "light" ? "dark" : "light";
            setStorageItem("color-theme", next);
            return next;
        });
    }, []);

    return <ThemeContext.Provider value={{ colorTheme, toggleColorTheme }}>{children}</ThemeContext.Provider>;
}

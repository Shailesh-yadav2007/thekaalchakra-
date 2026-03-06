"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Define our own props to avoid needing next-themes explicitly exported types if there's issue
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

"use client";

import { createContext, useContext, useState } from "react";

const AlternatePathContext = createContext<{
    alternatePath: string | undefined;
    setAlternatePath: (path: string | undefined) => void;
}>({
    alternatePath: undefined,
    setAlternatePath: () => { },
});

export function AlternatePathProvider({ children }: { children: React.ReactNode }) {
    const [alternatePath, setAlternatePath] = useState<string | undefined>(undefined);
    return (
        <AlternatePathContext.Provider value={{ alternatePath, setAlternatePath }}>
            {children}
        </AlternatePathContext.Provider>
    );
}

export function useAlternatePath() {
    return useContext(AlternatePathContext);
}

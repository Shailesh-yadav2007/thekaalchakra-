"use client";

import { useEffect } from "react";
import { useAlternatePath } from "./AlternatePathContext";

export function SetAlternatePath({ path }: { path: string }) {
    const { setAlternatePath } = useAlternatePath();

    useEffect(() => {
        setAlternatePath(path);
        return () => setAlternatePath(undefined); // cleanup on unmount
    }, [path, setAlternatePath]);

    return null; // does not render anything
}

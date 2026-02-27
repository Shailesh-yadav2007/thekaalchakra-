"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLanguage } from "@/lib/utils";

interface LanguageToggleProps {
    lang: SupportedLanguage;
}

export function LanguageToggle({ lang }: LanguageToggleProps) {
    const pathname = usePathname();

    const switchLang = lang === "hindi" ? "english" : "hindi";
    const switchPath = pathname.replace(`/${lang}`, `/${switchLang}`);

    return (
        <Link
            href={switchPath}
            className="language-toggle"
            title={lang === "hindi" ? "Switch to English" : "हिंदी में पढ़ें"}
        >
            <span className={`lang-option ${lang === "english" ? "active" : ""}`}>
                EN
            </span>
            <span className="lang-separator">|</span>
            <span className={`lang-option ${lang === "hindi" ? "active" : ""}`}>
                हि
            </span>
        </Link>
    );
}

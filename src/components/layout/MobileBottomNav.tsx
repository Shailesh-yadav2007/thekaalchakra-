"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, Zap, FileText, User } from "lucide-react";
import type { SupportedLanguage } from "@/lib/utils";

interface MobileBottomNavProps {
    lang: SupportedLanguage;
}

export function MobileBottomNav({ lang }: MobileBottomNavProps) {
    const pathname = usePathname();
    const isHindi = lang === "hindi";

    const navItems = [
        {
            label: isHindi ? "होम" : "Home",
            href: `/${lang}`,
            icon: Home,
            exact: true,
        },
        {
            label: isHindi ? "वीडियो" : "Videos",
            href: `/${lang}/videos`,
            icon: Video,
            exact: false,
        },
        {
            label: isHindi ? "शॉर्ट्स" : "Shorts",
            href: `/${lang}/videos?tab=shorts`,
            icon: Zap,
            exact: false,
        },
        {
            label: isHindi ? "ई-अखबार" : "E-Paper",
            href: `/${lang}/e-paper`,
            icon: FileText,
            exact: false,
        },
        {
            label: isHindi ? "प्रोफ़ाइल" : "Profile",
            href: "/admin/login",
            icon: User,
            exact: false,
        },
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg)] border-t border-[var(--color-border)] shadow-lg md:hidden flex items-center justify-around py-1.5 px-2 backdrop-blur-md bg-opacity-95"
            aria-label="Mobile Navigation"
        >
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href.split("?")[0]);

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors ${
                            isActive
                                ? "text-[var(--color-primary)] font-bold"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] font-medium"
                        }`}
                    >
                        <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                        <span className="text-[10px] mt-0.5 tracking-tight leading-none">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { mainNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Search, Menu, X, Moon, Sun } from "lucide-react";
import { useAlternatePath } from "@/components/layout/AlternatePathContext";
import type { SupportedLanguage } from "@/lib/utils";

interface NavbarProps {
    lang: SupportedLanguage;
}

export function Navbar({ lang }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { alternatePath } = useAlternatePath();
    const isHindi = lang === "hindi";

    return (
        <header className="navbar">
            {/* Top Bar */}
            <div className="navbar-top">
                <div className="navbar-container navbar-top-inner">
                    <time className="navbar-date">
                        {new Date().toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </time>
                    <div className="navbar-top-actions">
                        <LanguageToggle lang={lang} alternatePath={alternatePath} />
                    </div>
                </div>
            </div>

            {/* Main Nav */}
            <div className="navbar-main">
                <div className="navbar-container navbar-main-inner">
                    {/* Logo & Heading */}
                    <Link href={`/${lang}`} className="navbar-logo">
                        <Image src="/logo.png" alt="TheKaalchakra Logo" width={100} height={100} className="navbar-logo-img" />
                        <h4 className="navbar-logo-text font-serif text-sm -ml-6">TheKaalchakra</h4>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="navbar-nav desktop-only">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={`/${lang}${item.href}`}
                                className="navbar-link"
                            >
                                {isHindi ? item.labelHi : item.label}
                            </Link>
                        ))}
                        <Link href={`/${lang}/e-newspaper`} className="navbar-link">
                            {isHindi ? "ई-अखबार" : "E-Paper"}
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="navbar-actions">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="navbar-icon-btn"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="navbar-icon-btn mobile-only"
                            aria-label="Menu"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Bar (expandable) */}
            {isSearchOpen && (
                <div className="navbar-search">
                    <div className="navbar-container">
                        <form action={`/${lang}/search`} className="search-form">
                            <input
                                type="search"
                                name="q"
                                placeholder={isHindi ? "खबरें खोजें..." : "Search news..."}
                                className="search-input"
                                autoFocus
                            />
                            <button type="submit" className="search-submit">
                                <Search size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <nav className="mobile-nav">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={`/${lang}${item.href}`}
                                className="mobile-nav-link"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {isHindi ? item.labelHi : item.label}
                            </Link>
                        ))}
                        <Link
                            href={`/${lang}/e-newspaper`}
                            className="mobile-nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {isHindi ? "ई-अखबार" : "E-Paper"}
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

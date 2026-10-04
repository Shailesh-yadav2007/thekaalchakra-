"use client";

import Link from "next/link";
import { useState } from "react";
import { mainNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { KaalchakraLogo } from "@/components/layout/KaalchakraLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAlternatePath } from "@/components/layout/AlternatePathContext";
import {
    Search, Home, Menu, X, FileText, User, Facebook, Instagram, Youtube,
    Info, Phone, Shield, FileCheck, Moon
} from "lucide-react";
import type { SupportedLanguage } from "@/lib/utils";

interface NavbarProps {
    lang: SupportedLanguage;
}

interface StockData {
    name: string;
    value: string;
    change: string;
    isPositive: boolean;
}

const XIcon = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export function Navbar({ lang }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { alternatePath } = useAlternatePath();
    const isHindi = lang === "hindi";

    // Stock ticker data source
    const stock: StockData = {
        name: "NIFTY",
        value: "24,323.50",
        change: "+0.56% ↑",
        isPositive: true,
    };

    // Dates
    const now = new Date();
    const gregorianHindi = now.toLocaleDateString("hi-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const gregorianEnglish = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const panchangDate = isHindi ? "आषाढ़ शुक्ल पक्ष, चतुर्थी" : "Ashadha Shukla Paksha, Chaturthi";

    return (
        <header className="header-wrapper">
            {/* 1. Top Utility Bar (Black) */}
            <div className="utility-bar">
                <div className="utility-bar-inner">
                    {/* Left */}
                    <div className="utility-left">
                        <time className="utility-date">{gregorianHindi}</time>
                        <span className="opacity-40">|</span>
                        <Link href={`/${lang}/e-paper`} className="epaper-live-link">
                            <span>{isHindi ? "आज का ई-अखबार" : "Today's E-Paper"}</span>
                            <span className="live-dot" />
                        </Link>
                    </div>

                    {/* Center Tagline */}
                    <div className="utility-center hidden md:block">
                        <span>{isHindi ? "हमारा उद्देश्य: सच्ची खबर, निष्पक्ष विचार" : "Our Mission: True News, Unbiased Views"}</span>
                    </div>

                    {/* Right: Language & Socials */}
                    <div className="utility-right">
                        <LanguageToggle lang={lang} alternatePath={alternatePath} />
                        <div className="social-icons-row hidden sm:flex">
                            <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="YouTube">
                                <Youtube size={14} />
                            </a>
                            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Instagram">
                                <Instagram size={14} />
                            </a>
                            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Facebook">
                                <Facebook size={14} />
                            </a>
                            <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="X">
                                <XIcon size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Middle Header / Masthead Area */}
            <div className="header-main">
                <div className="header-main-inner">
                    {/* Left Block: Mobile Drawer Trigger + Search + Dates */}
                    <div className="header-left-block">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1.5 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors md:hidden"
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>

                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="search-trigger-btn"
                            aria-label="Search"
                        >
                            <Search size={18} />
                            <span className="hidden sm:inline">{isHindi ? "खोजें" : "Search"}</span>
                        </button>

                        <div className="header-date-block hidden md:flex">
                            <span className="gregorian-date">{gregorianEnglish}</span>
                            <span className="panchang-date">{panchangDate}</span>
                        </div>
                    </div>

                    {/* Center Block: Animated Kaalchakra Logo */}
                    <div className="header-center-block">
                        <KaalchakraLogo lang={lang} size="md" showTagline={true} />
                    </div>

                    {/* Right Block: Buttons & Stock Ticker */}
                    <div className="header-right-block">
                        <div className="header-buttons-row">
                            <Link href={`/${lang}/e-paper`} className="btn-epaper-red">
                                <FileText size={16} />
                                <span>{isHindi ? "ई-अखबार" : "E-Paper"}</span>
                            </Link>

                            <Link href="/admin/login" className="btn-login-outline hidden sm:flex">
                                <User size={16} />
                                <span>{isHindi ? "लॉग इन" : "Log In"}</span>
                            </Link>
                        </div>

                        <div className="stock-ticker-row hidden lg:flex">
                            <span className="stock-name">{stock.name}</span>
                            <span className="stock-value">{stock.value}</span>
                            <span className={`stock-change ${stock.isPositive ? "positive" : "negative"}`}>
                                {stock.change}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Dropdown Form */}
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

            {/* 3. Primary Category Navigation Bar */}
            <nav className="primary-nav-bar">
                <div className="primary-nav-inner">
                    {/* Active Home Icon */}
                    <Link href={`/${lang}`} className="nav-home-btn" aria-label="Home">
                        <Home size={18} />
                    </Link>

                    {/* Horizontal Categories Scroll */}
                    <div className="primary-nav-list">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={`/${lang}${item.href}`}
                                className="primary-nav-link"
                            >
                                {isHindi ? item.labelHi : item.label}
                            </Link>
                        ))}
                    </div>

                    {/* All Categories Drawer Trigger */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="nav-menu-btn"
                        aria-label="Toggle Category Menu"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </nav>

            {/* Mobile / Full Menu Slide Drawer (Matching Design Mockup) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setIsMenuOpen(false)}>
                    <div
                        className="relative w-4/5 max-w-sm bg-[var(--color-bg)] h-full shadow-2xl flex flex-col overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                            <KaalchakraLogo lang={lang} size="sm" showTagline={false} />
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Categories */}
                        <div className="py-2 flex-1 divide-y divide-[var(--color-border-light)]">
                            <div className="px-2 py-2">
                                <Link
                                    href={`/${lang}`}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 bg-red-50 dark:bg-red-950/30 font-bold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Home size={18} />
                                    <span>{isHindi ? "होम" : "Home"}</span>
                                </Link>
                                {mainNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={`/${lang}${item.href}`}
                                        className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>{isHindi ? item.labelHi : item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Informational Section */}
                            <div className="px-4 py-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
                                <Link
                                    href={`/${lang}/about`}
                                    className="flex items-center gap-3 py-1.5 hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Info size={16} />
                                    <span>{isHindi ? "हमारे बारे में" : "About Us"}</span>
                                </Link>
                                <Link
                                    href={`/${lang}/contact`}
                                    className="flex items-center gap-3 py-1.5 hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Phone size={16} />
                                    <span>{isHindi ? "संपर्क करें" : "Contact Us"}</span>
                                </Link>
                                <Link
                                    href={`/${lang}/privacy-policy`}
                                    className="flex items-center gap-3 py-1.5 hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Shield size={16} />
                                    <span>{isHindi ? "गोपनीयता नीति" : "Privacy Policy"}</span>
                                </Link>
                                <Link
                                    href={`/${lang}/terms`}
                                    className="flex items-center gap-3 py-1.5 hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FileCheck size={16} />
                                    <span>{isHindi ? "नियम व शर्तें" : "Terms & Conditions"}</span>
                                </Link>
                            </div>
                        </div>

                        {/* Drawer Footer: Socials & Dark Mode */}
                        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex items-center justify-between">
                            <div className="flex items-center gap-3 text-[var(--color-text)]">
                                <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-red-600">
                                    <Youtube size={18} />
                                </a>
                                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-pink-600">
                                    <Instagram size={18} />
                                </a>
                                <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-blue-600">
                                    <Facebook size={18} />
                                </a>
                                <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-gray-900 dark:hover:text-white">
                                    <XIcon size={16} />
                                </a>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[var(--color-text-muted)] font-medium">
                                    {isHindi ? "डार्क मोड" : "Dark Mode"}
                                </span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}



"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { mainNavItems } from "@/config/navigation";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useAlternatePath } from "@/components/layout/AlternatePathContext";
import { Search, Home, Menu, X, FileText, User, Facebook, Instagram, Youtube } from "lucide-react";
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

    // Stock ticker data source (dynamic state)
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
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Facebook">
                                <Facebook size={14} />
                            </a>
                            <a href="https://x.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="X">
                                <XIcon size={14} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Instagram">
                                <Instagram size={14} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="YouTube">
                                <Youtube size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Middle Header / Masthead Area */}
            <div className="header-main">
                <div className="header-main-inner">
                    {/* Left Block: Search + Dates */}
                    <div className="header-left-block">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="search-trigger-btn"
                            aria-label="Search"
                        >
                            <Search size={18} />
                            <span>{isHindi ? "खोजें" : "Search"}</span>
                        </button>

                        <div className="header-date-block">
                            <span className="gregorian-date">{gregorianEnglish}</span>
                            <span className="panchang-date">{panchangDate}</span>
                        </div>
                    </div>

                    {/* Center Block: Masthead Brand */}
                    <div className="header-center-block">
                        <Link href={`/${lang}`} className="masthead-brand">
                            <Image
                                src="/logo.png"
                                alt="TheKaalchakra Emblem"
                                width={54}
                                height={54}
                                className="masthead-emblem"
                                priority
                            />
                            <h1 className="masthead-wordmark">
                                {isHindi ? "द कालचक्र" : "The Kaalchakra"}
                            </h1>
                        </Link>

                        <div className="masthead-tagline-container">
                            <div className="tagline-line" />
                            <span className="masthead-tagline-text">
                                {isHindi ? "खबर नहीं, हकीकत" : "Not Just News, The Truth"}
                            </span>
                            <div className="tagline-line" />
                        </div>
                    </div>

                    {/* Right Block: Buttons & Stock Ticker */}
                    <div className="header-right-block">
                        <div className="header-buttons-row">
                            <Link href={`/${lang}/e-paper`} className="btn-epaper-red">
                                <FileText size={16} />
                                <span>{isHindi ? "ई-अखबार" : "E-Paper"}</span>
                            </Link>

                            <Link href="/admin/login" className="btn-login-outline">
                                <User size={16} />
                                <span>{isHindi ? "लॉग इन" : "Log In"}</span>
                            </Link>
                        </div>

                        <div className="stock-ticker-row">
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

            {/* 3. Primary Navigation Bar */}
            <nav className="primary-nav-bar">
                <div className="primary-nav-inner">
                    {/* Active Home Icon */}
                    <Link href={`/${lang}`} className="nav-home-btn" aria-label="Home">
                        <Home size={18} />
                    </Link>

                    {/* Horizontal 13 Categories */}
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

                    {/* All Categories / Menu Icon */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="nav-menu-btn"
                        aria-label="Toggle Category Menu"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
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
                    </nav>
                </div>
            )}
        </header>
    );
}


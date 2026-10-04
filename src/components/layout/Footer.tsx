import Link from "next/link";
import { siteConfig } from "@/config/site";
import { mainNavItems } from "@/config/navigation";
import { KaalchakraLogo } from "@/components/layout/KaalchakraLogo";
import { Youtube, Instagram, Facebook } from "lucide-react";
import type { SupportedLanguage } from "@/lib/utils";

interface FooterProps {
    lang: SupportedLanguage;
}

const XIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export function Footer({ lang }: FooterProps) {
    const isHindi = lang === "hindi";
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer bg-[var(--color-utility-bg)] text-white py-12 border-t border-[var(--color-border-dark)]">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand & Socials */}
                    <div className="footer-brand space-y-4">
                        <KaalchakraLogo lang={lang} size="sm" showTagline={true} className="text-white" />
                        <p className="footer-desc text-sm text-gray-300 max-w-sm">
                            {isHindi ? siteConfig.descriptionHi : siteConfig.description}
                        </p>
                        <div className="social-icons-row flex items-center gap-3 pt-2">
                            <a
                                href={siteConfig.social.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                                aria-label="YouTube"
                                title="YouTube"
                            >
                                <Youtube size={18} />
                            </a>
                            <a
                                href={siteConfig.social.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-pink-600 transition-colors"
                                aria-label="Instagram"
                                title="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href={siteConfig.social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                                aria-label="Facebook"
                                title="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href={siteConfig.social.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                                aria-label="X"
                                title="X"
                            >
                                <XIcon size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="footer-section">
                        <h3 className="footer-heading">
                            {isHindi ? "विभाग" : "Categories"}
                        </h3>
                        <ul className="footer-links">
                            {mainNavItems.slice(0, 6).map((item) => (
                                <li key={item.href}>
                                    <Link href={`/${lang}${item.href}`} className="footer-link">
                                        {isHindi ? item.labelHi : item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3 className="footer-heading">
                            {isHindi ? "त्वरित लिंक" : "Quick Links"}
                        </h3>
                        <ul className="footer-links">
                            <li>
                                <Link href={`/${lang}/videos`} className="footer-link">
                                    {isHindi ? "वीडियो" : "Videos"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/e-paper`} className="footer-link">
                                    {isHindi ? "ई-अखबार" : "E-Newspaper"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/editorial`} className="footer-link">
                                    {isHindi ? "सम्पादकीय" : "Editorial"}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-section">
                        <h3 className="footer-heading">
                            {isHindi ? "कानूनी" : "Legal"}
                        </h3>
                        <ul className="footer-links">
                            <li>
                                <Link href={`/${lang}/about`} className="footer-link">
                                    {isHindi ? "हमारे बारे में" : "About Us"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/contact`} className="footer-link">
                                    {isHindi ? "संपर्क करें" : "Contact Us"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/privacy-policy`} className="footer-link">
                                    {isHindi ? "गोपनीयता नीति" : "Privacy Policy"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/terms`} className="footer-link">
                                    {isHindi ? "नियम व शर्तें" : "Terms & Conditions"}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>
                        © {currentYear} {siteConfig.name}.{" "}
                        {isHindi ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}
                    </p>
                </div>
            </div>
        </footer>
    );
}

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { mainNavItems } from "@/config/navigation";
import type { SupportedLanguage } from "@/lib/utils";

interface FooterProps {
    lang: SupportedLanguage;
}

export function Footer({ lang }: FooterProps) {
    const isHindi = lang === "hindi";
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link href={`/${lang}`} className="footer-logo">
                            {isHindi ? siteConfig.nameHi : siteConfig.name}
                        </Link>
                        <p className="footer-desc">
                            {isHindi ? siteConfig.descriptionHi : siteConfig.description}
                        </p>
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
                                <Link href={`/${lang}/e-newspaper`} className="footer-link">
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

import Link from "next/link";
import { Download, Calendar, Smartphone } from "lucide-react";
import type { SupportedLanguage } from "@/lib/utils";

interface EPaperPromoBarProps {
    lang: SupportedLanguage;
}

export function EPaperPromoBar({ lang }: EPaperPromoBarProps) {
    const isHindi = lang === "hindi";

    return (
        <div className="epaper-promo-bar">
            <div className="epaper-promo-container">
                {/* Left: Heading & Subtitle */}
                <div className="promo-left-block">
                    <h3 className="promo-heading">
                        {isHindi ? "द कालचक्र ई-अखबार" : "The Kaalchakra E-Paper"}
                    </h3>
                    <p className="promo-subtext">
                        {isHindi
                            ? "जहां भी रहें, सच्ची खबरें पढ़ें"
                            : "Read true news, wherever you are"}
                    </p>
                </div>

                {/* Middle: 3 Feature Callouts */}
                <div className="promo-features-row">
                    <div className="promo-feature-item">
                        <Download size={18} className="feature-icon" />
                        <span>{isHindi ? "PDF डाउनलोड करें" : "Download PDF"}</span>
                    </div>

                    <div className="promo-feature-item">
                        <Calendar size={18} className="feature-icon" />
                        <span>{isHindi ? "15 दिन का आर्काइव एक्सेस" : "15-Day Archive Access"}</span>
                    </div>

                    <div className="promo-feature-item">
                        <Smartphone size={18} className="feature-icon" />
                        <span>{isHindi ? "सभी डिवाइस पर उपलब्ध" : "Available on All Devices"}</span>
                    </div>
                </div>

                {/* Right: Buttons */}
                <div className="promo-actions-row">
                    <Link href={`/${lang}/e-paper`} className="btn-promo-subscribe">
                        {isHindi ? "सब्सक्राइब करें ₹25/सप्ताह" : "Subscribe ₹25/week"}
                    </Link>

                    <Link href={`/${lang}/e-paper`} className="btn-promo-learn">
                        {isHindi ? "और जानें" : "Learn More"}
                    </Link>
                </div>
            </div>
        </div>
    );
}

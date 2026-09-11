import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Zap, ChevronRight } from "lucide-react";
import type { SupportedLanguage } from "@/lib/utils";

interface BreakingTickerProps {
    lang: SupportedLanguage;
}

export async function BreakingTicker({ lang }: BreakingTickerProps) {
    const isHindi = lang === "hindi";

    // Live data query: Fetch articles flagged as isBreaking and status PUBLISHED from Prisma DB
    const breakingArticles = await prisma.article.findMany({
        where: {
            isBreaking: true,
            status: "PUBLISHED",
        },
        select: {
            id: true,
            titleEn: true,
            titleHi: true,
            slugEn: true,
            slugHi: true,
            category: { select: { slugEn: true, slugHi: true } },
        },
        orderBy: { publishedAt: "desc" },
        take: 10,
    });

    if (breakingArticles.length === 0) return null;

    return (
        <div className="breaking-ticker">
            <div className="breaking-ticker-inner">
                {/* Fixed Red Pill Badge on Left */}
                <div className="breaking-label">
                    <span>{isHindi ? "ब्रेकिंग न्यूज़" : "BREAKING NEWS"}</span>
                    <Zap size={14} className="fill-current" />
                </div>

                {/* Scrolling Ticker Track */}
                <div className="ticker-wrapper">
                    <div className="ticker-track">
                        {[...breakingArticles, ...breakingArticles].map((article, idx) => {
                            const title = (isHindi ? article.titleHi : article.titleEn) || "";
                            const slug = (isHindi ? article.slugHi : article.slugEn) || "";
                            const catSlug = (isHindi ? article.category?.slugHi : article.category?.slugEn) || "news";

                            return (
                                <div key={`${article.id}-${idx}`} className="ticker-item">
                                    <Link href={`/${lang}/${catSlug}/${slug}`}>
                                        {title}
                                    </Link>
                                    <span className="ticker-bullet">•</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right-aligned See More Link */}
                <Link href={`/${lang}`} className="breaking-see-more">
                    <span>{isHindi ? "और देखें" : "See More"}</span>
                    <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    );
}


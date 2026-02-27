import { prisma } from "@/lib/prisma";
import type { SupportedLanguage } from "@/lib/utils";

interface BreakingTickerProps {
    lang: SupportedLanguage;
}

export async function BreakingTicker({ lang }: BreakingTickerProps) {
    const isHindi = lang === "hindi";

    const breakingArticles = await prisma.article.findMany({
        where: { isBreaking: true, status: "PUBLISHED" },
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
            <div className="container breaking-ticker-inner">
                <span className="breaking-label">
                    {isHindi ? "ब्रेकिंग" : "BREAKING"}
                </span>
                <div className="ticker-wrapper">
                    <div className="ticker-track">
                        {breakingArticles.map((article: typeof breakingArticles[number]) => {
                            const title = isHindi ? article.titleHi : article.titleEn;
                            const slug = isHindi ? article.slugHi : article.slugEn;
                            const catSlug = isHindi
                                ? article.category.slugHi
                                : article.category.slugEn;

                            return (
                                <a
                                    key={article.id}
                                    href={`/${lang}/${catSlug}/${slug}`}
                                    className="ticker-item"
                                >
                                    {title}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

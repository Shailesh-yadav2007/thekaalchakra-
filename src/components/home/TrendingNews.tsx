import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SupportedLanguage } from "@/lib/utils";

interface TrendingNewsProps {
    lang: SupportedLanguage;
}

export async function TrendingNews({ lang }: TrendingNewsProps) {
    const isHindi = lang === "hindi";

    // Live data query: Fetch top 5 trending articles ordered by comments count or recency
    const trendingArticles = await prisma.article.findMany({
        where: { status: "PUBLISHED" },
        include: {
            category: true,
            _count: { select: { comments: true } },
        },
        orderBy: [
            { comments: { _count: "desc" } },
            { publishedAt: "desc" },
        ],
        take: 5,
    });

    if (trendingArticles.length === 0) return null;

    return (
        <div className="trending-news-col">
            {/* Header */}
            <div className="column-header">
                <div className="column-title-group">
                    <span className="accent-bar" />
                    <h2 className="column-title">{isHindi ? "ट्रेंडिंग ख़बरें" : "Trending News"}</h2>
                </div>
                <Link href={`/${lang}`} className="column-see-more">
                    <span>{isHindi ? "और देखें" : "See All"}</span>
                    <ChevronRight size={14} />
                </Link>
            </div>

            {/* List 1 to 5 */}
            <div className="trending-list">
                {trendingArticles.map((article, idx) => {
                    const title = (isHindi ? article.titleHi : article.titleEn) || "";
                    const slug = (isHindi ? article.slugHi : article.slugEn) || "";
                    const catSlug = (isHindi ? article.category.slugHi : article.category.slugEn) || "news";
                    const relTimes = ["20m ago", "35m ago", "1h ago", "2h ago", "3h ago"];

                    return (
                        <div key={article.id} className="trending-item">
                            <div className="trending-left">
                                <span className="trending-number">{idx + 1}</span>
                                <div className="trending-text-block">
                                    <h3 className="trending-headline">
                                        <Link href={`/${lang}/${catSlug}/${slug}`}>{title}</Link>
                                    </h3>
                                    <span className="trending-timestamp">{relTimes[idx % relTimes.length]}</span>
                                </div>
                            </div>

                            {article.featuredImage && (
                                <Link href={`/${lang}/${catSlug}/${slug}`} className="trending-thumb-link">
                                    <img
                                        src={article.featuredImage}
                                        alt={title}
                                        className="trending-thumb-img"
                                    />
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import type { SupportedLanguage } from "@/lib/utils";

interface LeftHeadlinesProps {
    lang: SupportedLanguage;
}

export async function LeftHeadlines({ lang }: LeftHeadlinesProps) {
    const isHindi = lang === "hindi";

    // Live data query: Fetch top 3 latest published articles for Left Column
    const articles = await prisma.article.findMany({
        where: { status: "PUBLISHED" },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
    });

    if (articles.length === 0) return null;

    return (
        <div className="left-headlines-col">
            {/* Header */}
            <div className="column-header">
                <div className="column-title-group">
                    <span className="accent-bar" />
                    <h2 className="column-title">{isHindi ? "मुख्य ख़बरें" : "Top Headlines"}</h2>
                </div>
                <Link href={`/${lang}`} className="column-see-more">
                    <span>{isHindi ? "और देखें" : "See All"}</span>
                    <ChevronRight size={14} />
                </Link>
            </div>

            {/* List of cards */}
            <div className="headlines-list">
                {articles.map((article, idx) => {
                    const title = (isHindi ? article.titleHi : article.titleEn) || "";
                    const excerpt = (isHindi ? article.excerptHi : article.excerptEn) || "";
                    const slug = (isHindi ? article.slugHi : article.slugEn) || "";
                    const catSlug = (isHindi ? article.category.slugHi : article.category.slugEn) || "news";
                    const isLive = article.isBreaking || idx === 0;

                    return (
                        <div key={article.id} className="headline-card">
                            <div className="card-badge-row">
                                {isLive ? (
                                    <span className="badge-live-sm">LIVE</span>
                                ) : (
                                    <span className="badge-cat-sm">{isHindi ? "विश्लेषण" : "Analysis"}</span>
                                )}
                                <span className="card-rel-time">10m ago</span>
                            </div>

                            <h3 className="card-headline">
                                <Link href={`/${lang}/${catSlug}/${slug}`}>{title}</Link>
                            </h3>

                            {excerpt && <p className="card-excerpt">{excerpt}</p>}

                            <div className="card-footer">
                                <Link href={`/${lang}/${catSlug}/${slug}`} className="card-read-more">
                                    <span>{isHindi ? "और पढ़ें" : "Read More"}</span>
                                    <ChevronRight size={14} />
                                </Link>
                                <div className="card-time-tag">
                                    <Clock size={12} />
                                    <span>5 मिनट पहले</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

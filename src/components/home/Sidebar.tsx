import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { SupportedLanguage } from "@/lib/utils";

interface SidebarProps {
    lang: SupportedLanguage;
}

export async function Sidebar({ lang }: SidebarProps) {
    const isHindi = lang === "hindi";

    // Most popular (most comments)
    const popularArticles = await prisma.article.findMany({
        where: { status: "PUBLISHED" },
        include: {
            category: true,
            _count: { select: { comments: true } },
        },
        orderBy: { comments: { _count: "desc" } },
        take: 5,
    });

    return (
        <div className="sidebar">
            {/* Most Popular */}
            <div className="sidebar-widget">
                <h3 className="sidebar-title">
                    {isHindi ? "सबसे लोकप्रिय" : "Most Popular"}
                </h3>
                <div className="popular-list">
                    {popularArticles.map((article: typeof popularArticles[number], index: number) => {
                        const title = isHindi ? article.titleHi : article.titleEn;
                        const slug = isHindi ? article.slugHi : article.slugEn;
                        const catSlug = isHindi
                            ? article.category.slugHi
                            : article.category.slugEn;

                        return (
                            <a
                                key={article.id}
                                href={`/${lang}/${catSlug}/${slug}`}
                                className="popular-item"
                            >
                                <span className="popular-number">{index + 1}</span>
                                <div className="popular-content">
                                    <h4 className="popular-title">{title}</h4>
                                    {article.publishedAt && (
                                        <time className="popular-date">
                                            {formatDate(article.publishedAt, lang)}
                                        </time>
                                    )}
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Ad Space placeholder */}
            <div className="sidebar-widget ad-space">
                <span className="ad-label">
                    {isHindi ? "विज्ञापन" : "Advertisement"}
                </span>
            </div>
        </div>
    );
}

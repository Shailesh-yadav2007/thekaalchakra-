import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/article/ArticleCard";
import type { SupportedLanguage } from "@/lib/utils";

interface LatestNewsProps {
    lang: SupportedLanguage;
}

export async function LatestNews({ lang }: LatestNewsProps) {
    const isHindi = lang === "hindi";

    const latestArticles = await prisma.article.findMany({
        where: { status: "PUBLISHED" },
        include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            category: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 8,
    });

    if (latestArticles.length === 0) return null;

    return (
        <section className="latest-section">
            <div className="section-header">
                <h2 className="section-title">
                    {isHindi ? "ताज़ा खबरें" : "Latest News"}
                </h2>
                <a href={`/${lang}`} className="section-see-all">
                    {isHindi ? "सभी देखें →" : "See All →"}
                </a>
            </div>
            <div className="article-grid">
                {latestArticles.map((article: typeof latestArticles[number]) => (
                    <ArticleCard key={article.id} article={article} lang={lang} />
                ))}
            </div>
        </section>
    );
}

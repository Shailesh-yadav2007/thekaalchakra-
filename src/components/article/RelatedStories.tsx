import { prisma } from "@/lib/prisma";
import { ArticleCard } from "./ArticleCard";
import type { SupportedLanguage } from "@/lib/utils";

interface RelatedStoriesProps {
    articleId: string;
    categoryId: string;
    lang: SupportedLanguage;
}

export async function RelatedStories({
    articleId,
    categoryId,
    lang,
}: RelatedStoriesProps) {
    const isHindi = lang === "hindi";

    const relatedArticles = await prisma.article.findMany({
        where: {
            categoryId,
            status: "PUBLISHED",
            id: { not: articleId },
        },
        include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            category: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 4,
    });

    if (relatedArticles.length === 0) return null;

    return (
        <section className="related-stories">
            <h2 className="section-title">
                {isHindi ? "संबंधित खबरें" : "Related Stories"}
            </h2>
            <div className="article-grid">
                {relatedArticles.map((article: typeof relatedArticles[number]) => (
                    <ArticleCard key={article.id} article={article} lang={lang} />
                ))}
            </div>
        </section>
    );
}

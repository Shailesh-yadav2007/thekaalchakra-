import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/article/ArticleCard";
import type { SupportedLanguage } from "@/lib/utils";

interface CategorySectionProps {
    lang: SupportedLanguage;
    categorySlug: string;
}

export async function CategorySection({ lang, categorySlug }: CategorySectionProps) {
    const isHindi = lang === "hindi";

    const category = await prisma.category.findFirst({
        where: { slugEn: categorySlug },
    });

    if (!category) return null;

    const articles = await prisma.article.findMany({
        where: { categoryId: category.id, status: "PUBLISHED" },
        include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            category: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 4,
    });

    if (articles.length === 0) return null;

    const categoryName = isHindi ? category.nameHi : category.nameEn;
    const catSlug = isHindi ? category.slugHi : category.slugEn;

    return (
        <section className="category-section">
            <div className="section-header">
                <h2 className="section-title">{categoryName}</h2>
                <a href={`/${lang}/${catSlug}`} className="section-see-all">
                    {isHindi ? "और पढ़ें →" : "More →"}
                </a>
            </div>
            <div className="article-grid">
                {articles.map((article: typeof articles[number]) => (
                    <ArticleCard key={article.id} article={article} lang={lang} />
                ))}
            </div>
        </section>
    );
}

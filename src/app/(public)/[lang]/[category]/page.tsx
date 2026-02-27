import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ArticleCard } from "@/components/article/ArticleCard";
import type { SupportedLanguage } from "@/lib/utils";

interface CategoryPageProps {
    params: Promise<{ lang: string; category: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { lang, category } = await params;
    const isHindi = lang === "hindi";

    const cat = await prisma.category.findFirst({
        where: isHindi ? { slugHi: category } : { slugEn: category },
    });

    if (!cat) return { title: "Category Not Found" };

    const title = isHindi ? cat.nameHi : cat.nameEn;

    return {
        title: `${title} News`,
        description: `Latest ${title} news and articles on ${siteConfig.name}`,
        alternates: {
            canonical: `${siteConfig.url}/${lang}/${category}`,
            languages: {
                "en-IN": `${siteConfig.url}/english/${cat.slugEn}`,
                "hi-IN": `${siteConfig.url}/hindi/${cat.slugHi}`,
            },
        },
    };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { lang, category } = await params;
    const { page: pageParam } = await searchParams;
    const isHindi = lang === "hindi";
    const page = Math.max(1, parseInt(pageParam || "1"));
    const pageSize = 12;

    const cat = await prisma.category.findFirst({
        where: isHindi ? { slugHi: category } : { slugEn: category },
    });

    if (!cat) notFound();

    const [articles, total] = await Promise.all([
        prisma.article.findMany({
            where: { categoryId: cat.id, status: "PUBLISHED" },
            include: {
                author: { select: { id: true, name: true, avatarUrl: true } },
                category: true,
            },
            orderBy: { publishedAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.article.count({
            where: { categoryId: cat.id, status: "PUBLISHED" },
        }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const categoryName = isHindi ? cat.nameHi : cat.nameEn;

    return (
        <div className="container py-8">
            <header className="mb-8">
                <h1 className="section-title">{categoryName}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {isHindi
                        ? `${categoryName} से जुड़ी ताज़ा खबरें और लेख`
                        : `Latest news and articles in ${categoryName}`}
                </p>
            </header>

            {articles.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    {isHindi ? "अभी कोई लेख उपलब्ध नहीं है" : "No articles found in this category."}
                </div>
            ) : (
                <>
                    <div className="article-grid">
                        {articles.map((article: typeof articles[number]) => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                lang={lang as SupportedLanguage}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav className="pagination" aria-label="Pagination">
                            {page > 1 && (
                                <a
                                    href={`/${lang}/${category}?page=${page - 1}`}
                                    className="pagination-btn"
                                >
                                    {isHindi ? "← पिछला" : "← Previous"}
                                </a>
                            )}
                            <span className="pagination-info">
                                {isHindi
                                    ? `पृष्ठ ${page} / ${totalPages}`
                                    : `Page ${page} of ${totalPages}`}
                            </span>
                            {page < totalPages && (
                                <a
                                    href={`/${lang}/${category}?page=${page + 1}`}
                                    className="pagination-btn"
                                >
                                    {isHindi ? "अगला →" : "Next →"}
                                </a>
                            )}
                        </nav>
                    )}
                </>
            )}
        </div>
    );
}

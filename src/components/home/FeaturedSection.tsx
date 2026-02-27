import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { SupportedLanguage } from "@/lib/utils";

interface FeaturedSectionProps {
    lang: SupportedLanguage;
}

export async function FeaturedSection({ lang }: FeaturedSectionProps) {
    const isHindi = lang === "hindi";

    const featuredArticles = await prisma.article.findMany({
        where: { isFeatured: true, status: "PUBLISHED" },
        include: {
            author: { select: { name: true } },
            category: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 5,
    });

    if (featuredArticles.length === 0) return null;

    const [hero, ...rest] = featuredArticles;

    const getTitle = (a: typeof hero) => (isHindi ? a.titleHi : a.titleEn) || "";
    const getSlug = (a: typeof hero) => (isHindi ? a.slugHi : a.slugEn) || "";
    const getCatSlug = (a: typeof hero) =>
        isHindi ? a.category.slugHi : a.category.slugEn;
    const getCatName = (a: typeof hero) =>
        isHindi ? a.category.nameHi : a.category.nameEn;

    return (
        <section className="featured-section">
            <div className="container">
                <div className="featured-grid">
                    {/* Hero */}
                    <a
                        href={`/${lang}/${getCatSlug(hero)}/${getSlug(hero)}`}
                        className="featured-hero"
                    >
                        {hero.featuredImage && (
                            <img
                                src={hero.featuredImage}
                                alt={getTitle(hero)}
                                className="featured-hero-image"
                            />
                        )}
                        <div className="featured-hero-overlay">
                            <span className="category-badge">{getCatName(hero)}</span>
                            <h2 className="featured-hero-title">{getTitle(hero)}</h2>
                            <div className="featured-hero-meta">
                                <span>{hero.author.name}</span>
                                {hero.publishedAt && (
                                    <time>{formatDate(hero.publishedAt, lang)}</time>
                                )}
                            </div>
                        </div>
                    </a>

                    {/* Secondary Featured */}
                    <div className="featured-sidebar">
                        {rest.map((article: typeof featuredArticles[number]) => (
                            <a
                                key={article.id}
                                href={`/${lang}/${getCatSlug(article)}/${getSlug(article)}`}
                                className="featured-card"
                            >
                                {article.featuredImage && (
                                    <img
                                        src={article.featuredImage}
                                        alt={getTitle(article)}
                                        className="featured-card-image"
                                    />
                                )}
                                <div className="featured-card-content">
                                    <span className="category-badge-sm">
                                        {getCatName(article)}
                                    </span>
                                    <h3 className="featured-card-title">{getTitle(article)}</h3>
                                    {article.publishedAt && (
                                        <time className="featured-card-date">
                                            {formatDate(article.publishedAt, lang)}
                                        </time>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

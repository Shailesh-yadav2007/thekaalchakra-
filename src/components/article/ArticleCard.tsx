import { formatDate } from "@/lib/utils";
import type { SupportedLanguage } from "@/lib/utils";

interface ArticleCardProps {
    article: {
        id: string;
        titleEn: string | null;
        titleHi: string | null;
        slugEn: string | null;
        slugHi: string | null;
        excerptEn: string | null;
        excerptHi: string | null;
        featuredImage: string | null;
        publishedAt: Date | null;
        author: { id: string; name: string; avatarUrl: string | null };
        category: {
            nameEn: string;
            nameHi: string;
            slugEn: string;
            slugHi: string;
        };
    };
    lang: SupportedLanguage;
}

export function ArticleCard({ article, lang }: ArticleCardProps) {
    const isHindi = lang === "hindi";
    const title = isHindi ? article.titleHi : article.titleEn;
    const excerpt = isHindi ? article.excerptHi : article.excerptEn;
    const slug = isHindi ? article.slugHi : article.slugEn;
    const catSlug = isHindi ? article.category.slugHi : article.category.slugEn;
    const catName = isHindi ? article.category.nameHi : article.category.nameEn;

    return (
        <a href={`/${lang}/${catSlug}/${slug}`} className="article-card">
            {article.featuredImage && (
                <div className="article-card-image-wrapper">
                    <img
                        src={article.featuredImage}
                        alt={title || ""}
                        className="article-card-image"
                        loading="lazy"
                    />
                </div>
            )}
            <div className="article-card-body">
                <span className="category-badge-sm">{catName}</span>
                <h3 className="article-card-title">{title}</h3>
                {excerpt && <p className="article-card-excerpt">{excerpt}</p>}
                <div className="article-card-meta">
                    <span>{article.author.name}</span>
                    {article.publishedAt && (
                        <time>{formatDate(article.publishedAt, lang)}</time>
                    )}
                </div>
            </div>
        </a>
    );
}

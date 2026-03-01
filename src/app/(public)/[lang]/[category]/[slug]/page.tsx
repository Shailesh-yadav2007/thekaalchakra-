import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";
import { ArticleContent } from "@/components/article/ArticleContent";
import { ShareButtons } from "@/components/article/ShareButtons";
import { RelatedStories } from "@/components/article/RelatedStories";
import { SetAlternatePath } from "@/components/layout/SetAlternatePath";

import type { SupportedLanguage } from "@/lib/utils";

interface ArticlePageProps {
    params: Promise<{ lang: string; category: string; slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { lang, slug } = await params;
    const isHindi = lang === "hindi";

    const article = await prisma.article.findFirst({
        where: isHindi ? { slugHi: slug, status: "PUBLISHED" } : { slugEn: slug, status: "PUBLISHED" },
        include: { category: true },
    });

    if (!article) return { title: "Article Not Found" };

    const title = isHindi
        ? (article.metaTitleHi || article.titleHi || "")
        : (article.metaTitleEn || article.titleEn || "");
    const description = isHindi
        ? (article.metaDescHi || article.excerptHi || "")
        : (article.metaDescEn || article.excerptEn || "");

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            publishedTime: article.publishedAt?.toISOString(),
            images: article.featuredImage ? [{ url: article.featuredImage }] : [],
        },
        alternates: {
            canonical: `${siteConfig.url}/${lang}/${isHindi ? article.category.slugHi : article.category.slugEn}/${slug}`,
            languages: {
                ...(article.slugEn && { "en-IN": `${siteConfig.url}/english/${article.category.slugEn}/${article.slugEn}` }),
                ...(article.slugHi && { "hi-IN": `${siteConfig.url}/hindi/${article.category.slugHi}/${article.slugHi}` }),
            },
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { lang, slug, category } = await params;
    const isHindi = lang === "hindi";

    const article = await prisma.article.findFirst({
        where: isHindi ? { slugHi: slug, status: "PUBLISHED" } : { slugEn: slug, status: "PUBLISHED" },
        include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            editor: { select: { id: true, name: true } },
            category: true,
            tags: { include: { tag: true } },
        },
    });

    if (!article) notFound();

    const title = isHindi ? article.titleHi : article.titleEn;
    const excerpt = isHindi ? article.excerptHi : article.excerptEn;
    const body = isHindi ? article.bodyHi : article.bodyEn;
    const categoryName = isHindi ? article.category.nameHi : article.category.nameEn;
    const categorySlug = isHindi ? article.category.slugHi : article.category.slugEn;

    // JSON-LD Schema markup
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: title,
        description: excerpt,
        image: article.featuredImage,
        datePublished: article.publishedAt?.toISOString(),
        dateModified: article.updatedAt.toISOString(),
        author: {
            "@type": "Person",
            name: article.author.name,
        },
        publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
        },
    };

    const alternatePath = isHindi
        ? (article.slugEn ? `/english/${article.category.slugEn}/${article.slugEn}` : `/english/${article.category.slugEn}`)
        : (article.slugHi ? `/hindi/${article.category.slugHi}/${article.slugHi}` : `/hindi/${article.category.slugHi}`);

    return (
        <>
            <SetAlternatePath path={alternatePath} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="container article-page">
                {/* Breadcrumb */}
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <a href={`/${lang}`}>{isHindi ? "होम" : "Home"}</a>
                    <span className="breadcrumb-separator">/</span>
                    <a href={`/${lang}/${categorySlug}`}>{categoryName}</a>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{title}</span>
                </nav>

                {/* Article Header */}
                <header className="article-header">
                    <span className="category-badge">{categoryName}</span>
                    <h1 className="article-title">{title}</h1>
                    {excerpt && <p className="article-excerpt">{excerpt}</p>}

                    <div className="article-meta">
                        <div className="meta-author">
                            <span className="author-name">{article.author.name}</span>
                            {article.publishedAt && (
                                <time dateTime={article.publishedAt.toISOString()}>
                                    {formatDate(article.publishedAt, lang as SupportedLanguage)}
                                </time>
                            )}
                        </div>
                        <ShareButtons
                            url={`${siteConfig.url}/${lang}/${categorySlug}/${slug}`}
                            title={title || ""}
                        />
                    </div>
                </header>

                {/* Featured Image */}
                {article.featuredImage && (
                    <figure className="article-featured-image">
                        <img
                            src={article.featuredImage}
                            alt={title || "Article image"}
                            loading="eager"
                        />
                    </figure>
                )}

                {/* Article Body */}
                <ArticleContent content={body || ""} />

                {/* Tags */}
                {article.tags.length > 0 && (
                    <div className="article-tags">
                        {article.tags.map(({ tag }: { tag: { id: string; nameEn: string; nameHi: string; slug: string } }) => (
                            <span key={tag.id} className="tag-badge">
                                {isHindi ? tag.nameHi : tag.nameEn}
                            </span>
                        ))}
                    </div>
                )}

                {/* Related Stories */}
                <RelatedStories
                    articleId={article.id}
                    categoryId={article.categoryId}
                    lang={lang as SupportedLanguage}
                />


            </article>
        </>
    );
}

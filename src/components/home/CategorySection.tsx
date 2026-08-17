import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Play, ChevronRight } from "lucide-react";
import type { SupportedLanguage } from "@/lib/utils";

interface CategorySectionProps {
    lang: SupportedLanguage;
    categorySlug?: string;
}

export async function CategorySection({ lang }: CategorySectionProps) {
    const isHindi = lang === "hindi";

    // 1. Fetch articles for देश (India)
    const deshArticles = await prisma.article.findMany({
        where: {
            status: "PUBLISHED",
            category: { slugEn: { in: ["india", "desh", "national"] } },
        },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
    });

    // Fallback for deshArticles if specific category is empty
    const desh = deshArticles.length > 0 ? deshArticles : await prisma.article.findMany({
        where: { status: "PUBLISHED" },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
    });

    // 2. Fetch articles for राज्य (State)
    const rajyaArticles = await prisma.article.findMany({
        where: {
            status: "PUBLISHED",
            category: { slugEn: { in: ["state", "rajya", "local"] } },
        },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
    });

    const rajya = rajyaArticles.length > 0 ? rajyaArticles : desh;

    // 3. Fetch video article for वीडियो (Videos)
    const videoArticle = await prisma.article.findFirst({
        where: {
            status: "PUBLISHED",
            category: { slugEn: { in: ["video", "videos", "multimedia"] } },
        },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
    }) || desh[0];

    // 4. Fetch editorial article for संपादकीय (Editorial)
    const editorialArticle = await prisma.article.findFirst({
        where: {
            status: "PUBLISHED",
            category: { slugEn: { in: ["editorial", "opinion", "vichar"] } },
        },
        include: { category: true, author: true },
        orderBy: { publishedAt: "desc" },
    }) || desh[1] || desh[0];

    return (
        <section className="four-category-section">
            <div className="category-row-container">
                <div className="four-column-category-grid">
                    {/* Column 1: देश */}
                    <div className="category-column">
                        <div className="column-header">
                            <div className="column-title-group">
                                <span className="accent-bar" />
                                <h2 className="column-title">{isHindi ? "देश" : "India"}</h2>
                            </div>
                            <Link href={`/${lang}/india`} className="column-see-more">
                                <span>{isHindi ? "और देखें" : "See All"}</span>
                                <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="cat-stacked-list">
                            {desh.map((article, idx) => {
                                const title = (isHindi ? article.titleHi : article.titleEn) || "";
                                const slug = (isHindi ? article.slugHi : article.slugEn) || "";
                                const catSlug = (isHindi ? article.category?.slugHi : article.category?.slugEn) || "india";
                                const times = ["1h ago", "2h ago", "3h ago"];

                                return (
                                    <div key={article.id} className="cat-stacked-card">
                                        {article.featuredImage && (
                                            <Link href={`/${lang}/${catSlug}/${slug}`} className="cat-card-thumb">
                                                <img src={article.featuredImage} alt={title} className="cat-thumb-img" />
                                            </Link>
                                        )}
                                        <div className="cat-card-body">
                                            <h3 className="cat-card-title">
                                                <Link href={`/${lang}/${catSlug}/${slug}`}>{title}</Link>
                                            </h3>
                                            <span className="cat-card-time">{times[idx % times.length]}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Column 2: राज्य */}
                    <div className="category-column">
                        <div className="column-header">
                            <div className="column-title-group">
                                <span className="accent-bar" />
                                <h2 className="column-title">{isHindi ? "राज्य" : "State"}</h2>
                            </div>
                            <Link href={`/${lang}/state`} className="column-see-more">
                                <span>{isHindi ? "और देखें" : "See All"}</span>
                                <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="cat-stacked-list">
                            {rajya.map((article, idx) => {
                                const title = (isHindi ? article.titleHi : article.titleEn) || "";
                                const slug = (isHindi ? article.slugHi : article.slugEn) || "";
                                const catSlug = (isHindi ? article.category?.slugHi : article.category?.slugEn) || "state";
                                const times = ["1h ago", "2h ago", "3h ago"];

                                return (
                                    <div key={article.id} className="cat-stacked-card">
                                        {article.featuredImage && (
                                            <Link href={`/${lang}/${catSlug}/${slug}`} className="cat-card-thumb">
                                                <img src={article.featuredImage} alt={title} className="cat-thumb-img" />
                                            </Link>
                                        )}
                                        <div className="cat-card-body">
                                            <h3 className="cat-card-title">
                                                <Link href={`/${lang}/${catSlug}/${slug}`}>{title}</Link>
                                            </h3>
                                            <span className="cat-card-time">{times[idx % times.length]}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Column 3: वीडियो */}
                    <div className="category-column">
                        <div className="column-header">
                            <div className="column-title-group">
                                <span className="accent-bar" />
                                <h2 className="column-title">{isHindi ? "वीडियो" : "Videos"}</h2>
                            </div>
                            <Link href={`/${lang}/videos`} className="column-see-more">
                                <span>{isHindi ? "और देखें" : "See All"}</span>
                                <ChevronRight size={14} />
                            </Link>
                        </div>

                        {videoArticle && (() => {
                            const title = (isHindi ? videoArticle.titleHi : videoArticle.titleEn) || "";
                            const slug = (isHindi ? videoArticle.slugHi : videoArticle.slugEn) || "";
                            const catSlug = (isHindi ? videoArticle.category?.slugHi : videoArticle.category?.slugEn) || "videos";

                            return (
                                <div className="video-single-card">
                                    <Link href={`/${lang}/${catSlug}/${slug}`} className="video-thumb-container">
                                        {videoArticle.featuredImage ? (
                                            <img src={videoArticle.featuredImage} alt={title} className="video-thumb-img" />
                                        ) : (
                                            <div className="video-thumb-fallback" />
                                        )}
                                        <div className="video-play-overlay">
                                            <div className="play-button-circle">
                                                <Play size={20} className="fill-white text-white ml-0.5" />
                                            </div>
                                        </div>
                                        <span className="video-duration-badge">02:45</span>
                                    </Link>

                                    <h3 className="video-card-title">
                                        <Link href={`/${lang}/${catSlug}/${slug}`}>{title}</Link>
                                    </h3>
                                    <span className="cat-card-time">5h ago</span>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Column 4: संपादकीय */}
                    <div className="category-column">
                        <div className="column-header">
                            <div className="column-title-group">
                                <span className="accent-bar" />
                                <h2 className="column-title">{isHindi ? "संपादकीय" : "Editorial"}</h2>
                            </div>
                            <Link href={`/${lang}/editorial`} className="column-see-more">
                                <span>{isHindi ? "और देखें" : "See All"}</span>
                                <ChevronRight size={14} />
                            </Link>
                        </div>

                        {editorialArticle && (() => {
                            const title = (isHindi ? editorialArticle.titleHi : editorialArticle.titleEn) || "";
                            const slug = (isHindi ? editorialArticle.slugHi : editorialArticle.slugEn) || "";
                            const catSlug = (isHindi ? editorialArticle.category?.slugHi : editorialArticle.category?.slugEn) || "editorial";

                            return (
                                <div className="editorial-single-card">
                                    {editorialArticle.featuredImage && (
                                        <Link href={`/${lang}/${catSlug}/${slug}`} className="editorial-thumb-container">
                                            <img src={editorialArticle.featuredImage} alt={title} className="editorial-thumb-img" />
                                        </Link>
                                    )}

                                    <h3 className="editorial-card-title">
                                        <Link href={`/${lang}/${catSlug}/${slug}`}>{title}</Link>
                                    </h3>

                                    {/* Byline Row matching reference design */}
                                    <div className="editorial-byline-row">
                                        <div className="editorial-mark">K</div>
                                        <div className="editorial-byline-text">
                                            <span className="byline-role">{isHindi ? "संपादक" : "Editor"}</span>
                                            <span className="byline-name">{isHindi ? "द कालचक्र" : "The Kaalchakra"}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </section>
    );
}


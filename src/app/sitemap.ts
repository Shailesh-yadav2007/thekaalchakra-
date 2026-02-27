import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: `${baseUrl}/english`, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
        { url: `${baseUrl}/hindi`, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    ];

    // Published articles
    const articles = await prisma.article.findMany({
        where: { status: "PUBLISHED" },
        select: {
            slugEn: true,
            slugHi: true,
            updatedAt: true,
            category: { select: { slugEn: true, slugHi: true } },
        },
    });

    const articlePages: MetadataRoute.Sitemap = articles.flatMap((article: typeof articles[number]) => {
        const pages: MetadataRoute.Sitemap = [];
        if (article.slugEn && article.category.slugEn) {
            pages.push({
                url: `${baseUrl}/english/${article.category.slugEn}/${article.slugEn}`,
                lastModified: article.updatedAt,
                changeFrequency: "daily",
                priority: 0.8,
            });
        }
        if (article.slugHi && article.category.slugHi) {
            pages.push({
                url: `${baseUrl}/hindi/${article.category.slugHi}/${article.slugHi}`,
                lastModified: article.updatedAt,
                changeFrequency: "daily",
                priority: 0.8,
            });
        }
        return pages;
    });

    // Categories
    const categories = await prisma.category.findMany({
        select: { slugEn: true, slugHi: true },
    });

    const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat: typeof categories[number]) => [
        { url: `${baseUrl}/english/${cat.slugEn}`, changeFrequency: "daily" as const, priority: 0.6 },
        { url: `${baseUrl}/hindi/${cat.slugHi}`, changeFrequency: "daily" as const, priority: 0.6 },
    ]);

    return [...staticPages, ...articlePages, ...categoryPages];
}

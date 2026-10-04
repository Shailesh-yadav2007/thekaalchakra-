import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { VideoGrid, type VideoItem } from "@/components/video/VideoGrid";
import type { SupportedLanguage } from "@/lib/utils";

interface PageProps {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ tab?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    const isHindi = lang === "hindi";

    return {
        title: isHindi ? `वीडियो | ${siteConfig.nameHi}` : `Videos | ${siteConfig.name}`,
        description: isHindi
            ? `${siteConfig.nameHi} की ताज़ा वीडियो खबरें, ग्राउंड रिपोर्ट और चर्चाएँ`
            : `Latest video news, ground reports, and discussions on ${siteConfig.name}`,
    };
}

export default async function VideosPage({ params, searchParams }: PageProps) {
    const { lang } = await params;
    const { tab } = await searchParams;
    const isHindi = lang === "hindi";

    // 1. Fetch video articles from database
    const dbArticles = await prisma.article.findMany({
        where: {
            status: "PUBLISHED",
            OR: [
                { category: { slugEn: "videos" } },
                { category: { slugHi: "video" } },
                { bodyEn: { contains: "youtube.com" } },
                { bodyHi: { contains: "youtube.com" } },
                { bodyEn: { contains: "youtu.be" } },
                { bodyHi: { contains: "youtu.be" } },
            ],
        },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 20,
    });

    // 2. Default Official Kaalchakra Channel Videos (Fallback/Automated Channel Feed)
    const channelVideos: VideoItem[] = [
        {
            id: "vid-1",
            titleHi: "भारत की नई रणनीति | क्या बदल रहा है दक्षिण एशिया का समीकरण?",
            titleEn: "India's New Strategy | How South Asian Geopolitics is Changing",
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: "8:24",
            views: "12K views",
            publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
            tag: "special",
        },
        {
            id: "vid-2",
            titleHi: "उत्तराखंड में भारी बारिश: ग्राउंड से हमारी खास रिपोर्ट",
            titleEn: "Heavy Rainfall in Uttarakhand: Special Ground Report",
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: "6:17",
            views: "8.4K views",
            publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
            tag: "ground",
        },
        {
            id: "vid-3",
            titleHi: "ISRO और भारत का अंतरिक्ष भविष्य | 2035 स्पेस स्टेशन विज़न",
            titleEn: "ISRO & India's Space Future | 2035 Space Station Vision",
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: "10:12",
            views: "25K views",
            publishedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
            tag: "discussion",
        },
        {
            id: "vid-4",
            titleHi: "संसद में आज क्या हुआ? 1 मिनट में पूरी जानकारी #Shorts",
            titleEn: "What Happened in Parliament Today? 1-Min Recap #Shorts",
            youtubeUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
            duration: "0:58",
            views: "45K views",
            publishedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
            tag: "shorts",
        },
    ];

    // Map DB articles into VideoItem format if available
    const dbVideoItems: VideoItem[] = dbArticles.map((art) => {
        const bodyText = art.bodyEn || art.bodyHi || "";
        const youtubeMatch = bodyText.match(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s"<]+/);
        return {
            id: art.id,
            titleHi: art.titleHi || art.titleEn || "Untitled Video",
            titleEn: art.titleEn || art.titleHi || "Untitled Video",
            youtubeUrl: youtubeMatch ? youtubeMatch[0] : "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnailUrl: art.featuredImage || undefined,
            publishedAt: art.publishedAt || art.createdAt,
            tag: "special",
        };
    });

    const combinedVideos = [...dbVideoItems, ...channelVideos];

    return (
        <div className="container py-8 max-w-7xl mx-auto px-4">
            {/* Header Title */}
            <div className="mb-6 border-b border-[var(--color-border)] pb-4">
                <h1 className="text-2xl md:text-3xl font-bold font-serif text-[var(--color-text)] flex items-center gap-3">
                    <span className="w-3 h-8 bg-red-600 rounded-full inline-block" />
                    {isHindi ? "वीडियो" : "Videos"}
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {isHindi
                        ? "द कालचक्र की विशेष वीडियो रिपोर्टिंग, इंटरव्यू और चर्चाएँ"
                        : "Special video reporting, interviews, and discussions by The Kaalchakra"}
                </p>
            </div>

            {/* Interactive Video Feed Grid */}
            <VideoGrid videos={combinedVideos} lang={lang as SupportedLanguage} />
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import { LeftHeadlines } from "@/components/home/LeftHeadlines";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { TrendingNews } from "@/components/home/TrendingNews";
import type { SupportedLanguage } from "@/lib/utils";

interface FeaturedSectionProps {
    lang: SupportedLanguage;
}

export async function FeaturedSection({ lang }: FeaturedSectionProps) {
    // Live data query: Fetch featured articles for center carousel
    const featuredArticles = await prisma.article.findMany({
        where: { status: "PUBLISHED" },
        include: {
            author: { select: { name: true } },
            category: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 5,
    });

    return (
        <section className="hero-grid-section">
            <div className="hero-grid-container">
                <div className="hero-three-column-grid">
                    {/* Left Column: Top Headlines */}
                    <aside className="hero-left-col">
                        <LeftHeadlines lang={lang} />
                    </aside>

                    {/* Center Column: Featured Carousel */}
                    <main className="hero-center-col">
                        <FeaturedCarousel articles={featuredArticles} lang={lang} />
                    </main>

                    {/* Right Column: Trending News */}
                    <aside className="hero-right-col">
                        <TrendingNews lang={lang} />
                    </aside>
                </div>
            </div>
        </section>
    );
}


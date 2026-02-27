import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { BreakingTicker } from "@/components/home/BreakingTicker";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { LatestNews } from "@/components/home/LatestNews";
import { CategorySection } from "@/components/home/CategorySection";
import { Sidebar } from "@/components/home/Sidebar";
import type { SupportedLanguage } from "@/lib/utils";

interface HomePageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
    const { lang } = await params;
    const isHindi = lang === "hindi";

    return {
        title: isHindi ? siteConfig.nameHi : siteConfig.name,
        description: isHindi ? siteConfig.descriptionHi : siteConfig.description,
        alternates: {
            canonical: `${siteConfig.url}/${lang}`,
            languages: {
                "en-IN": `${siteConfig.url}/english`,
                "hi-IN": `${siteConfig.url}/hindi`,
            },
        },
    };
}

export default async function HomePage({ params }: HomePageProps) {
    const { lang } = await params;

    return (
        <>
            {/* Breaking News Ticker */}
            <BreakingTicker lang={lang as SupportedLanguage} />

            {/* Featured Stories */}
            <FeaturedSection lang={lang as SupportedLanguage} />

            {/* Main Content Grid */}
            <div className="container">
                <div className="content-grid">
                    {/* Main Column */}
                    <div className="main-column">
                        <LatestNews lang={lang as SupportedLanguage} />

                        {/* Category Sections */}
                        <CategorySection
                            lang={lang as SupportedLanguage}
                            categorySlug="politics"
                        />
                        <CategorySection
                            lang={lang as SupportedLanguage}
                            categorySlug="technology"
                        />
                        <CategorySection
                            lang={lang as SupportedLanguage}
                            categorySlug="sports"
                        />
                    </div>

                    {/* Sidebar */}
                    <aside className="sidebar-column">
                        <Sidebar lang={lang as SupportedLanguage} />
                    </aside>
                </div>
            </div>
        </>
    );
}

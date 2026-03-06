import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ArticleCard } from '@/components/article/ArticleCard';
import { notFound } from 'next/navigation';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
    const { q } = await searchParams;
    return {
        title: q ? `Search Results for "${q}" | TheKaalchakra` : 'Search | TheKaalchakra',
        description: `Search results for news articles related to ${q || 'current events'}.`,
    };
}

export default async function SearchPage(
    { params, searchParams }: {
        params: Promise<{ lang: string }>,
        searchParams: Promise<{ q?: string }>
    }
) {
    const { lang } = await params;
    const { q } = await searchParams;

    if (lang !== 'english' && lang !== 'hindi') {
        notFound();
    }

    const isHindi = lang === 'hindi';
    const searchQuery = q || '';

    // Choose which fields to search based on lang
    const searchConditions = isHindi
        ? [
            { titleHi: { contains: searchQuery, mode: 'insensitive' as const } },
            { excerptHi: { contains: searchQuery, mode: 'insensitive' as const } },
            { bodyHi: { contains: searchQuery, mode: 'insensitive' as const } },
        ]
        : [
            { titleEn: { contains: searchQuery, mode: 'insensitive' as const } },
            { excerptEn: { contains: searchQuery, mode: 'insensitive' as const } },
            { bodyEn: { contains: searchQuery, mode: 'insensitive' as const } },
        ];

    // Fetch matching articles
    const articles = await prisma.article.findMany({
        where: {
            status: 'PUBLISHED',
            OR: searchConditions,
            publishedAt: {
                lte: new Date(),
            }
        },
        include: {
            category: {
                select: {
                    nameEn: true,
                    nameHi: true,
                    slugEn: true,
                    slugHi: true,
                }
            },
            author: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                }
            }
        },
        orderBy: {
            publishedAt: 'desc',
        },
        // Limit results realistically
        take: 30,
    });

    const serializedArticles = articles.map(article => ({
        id: article.id,
        titleEn: article.titleEn,
        titleHi: article.titleHi,
        slugEn: article.slugEn,
        slugHi: article.slugHi,
        excerptEn: article.excerptEn,
        excerptHi: article.excerptHi,
        featuredImage: article.featuredImage,
        publishedAt: article.publishedAt,
        author: {
            id: article.author.id,
            name: article.author.name,
            avatarUrl: article.author.avatarUrl
        },
        category: article.category,
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-[var(--color-primary)] mb-2">
                    {isHindi ? 'खोज परिणाम' : 'Search Results'}
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    {isHindi ? (
                        <>
                            <strong>"{searchQuery}"</strong> के लिए {articles.length} परिणाम मिले
                        </>
                    ) : (
                        <>
                            Found {articles.length} result{articles.length !== 1 ? 's' : ''} for <strong>"{searchQuery}"</strong>
                        </>
                    )}
                </p>
            </div>

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serializedArticles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article as any}
                            lang={lang as any}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-light)] text-center px-4">
                    <div className="w-16 h-16 mb-4 text-[var(--color-text-muted)]">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-[var(--color-text)] mb-2">
                        {isHindi ? 'कोई परिणाम नहीं मिला' : 'No results found'}
                    </h3>
                    <p className="text-[var(--color-text-secondary)]">
                        {isHindi
                            ? 'कृपया अलग-अलग कीवर्ड के साथ दोबारा खोजें या होमपेज पर वापस जाएं।'
                            : 'Please try searching again with different keywords or head back to the homepage.'}
                    </p>
                </div>
            )}
        </div>
    );
}

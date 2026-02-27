import { prisma } from "@/lib/prisma";
import type { SupportedLanguage } from "@/lib/utils";
import Link from "next/link";

interface ENewspaperPageProps {
    params: Promise<{ lang: string }>;
}

export default async function ENewspaperPage({ params }: ENewspaperPageProps) {
    const { lang } = await params;
    const isHindi = lang === "hindi";

    const newspapers = await prisma.eNewspaper.findMany({
        orderBy: { publishDate: "desc" },
        take: 30,
    });

    return (
        <div className="container py-8">
            <h1 className="section-title">
                {isHindi ? "ई-अखबार" : "E-Newspaper"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                {isHindi
                    ? "दैनिक अखबार का डिजिटल संस्करण पढ़ें"
                    : "Read the digital edition of our daily newspaper"}
            </p>

            {newspapers.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    {isHindi ? "अभी कोई संस्करण उपलब्ध नहीं है" : "No editions available yet."}
                </div>
            ) : (
                <div className="enewspaper-grid">
                    {newspapers.map((paper: typeof newspapers[number]) => (
                        <a
                            key={paper.id}
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="enewspaper-card"
                        >
                            <div className="enewspaper-icon">📰</div>
                            <h3 className="enewspaper-title">
                                {isHindi ? paper.titleHi : paper.titleEn}
                            </h3>
                            <time className="enewspaper-date">
                                {paper.publishDate.toLocaleDateString(
                                    isHindi ? "hi-IN" : "en-IN",
                                    { year: "numeric", month: "long", day: "numeric" }
                                )}
                            </time>
                            <span className="enewspaper-lang-badge">
                                {paper.language === "HINDI" ? "हिंदी" : "English"}
                            </span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

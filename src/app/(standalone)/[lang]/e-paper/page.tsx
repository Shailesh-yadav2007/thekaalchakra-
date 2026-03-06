import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { EPaperClient } from "@/components/epaper/EPaperClient";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: `E-Paper | ${siteConfig.name}`,
    description: "Read the latest e-newspapers from TheKaalchakra",
};

export default async function EPaperStandalonePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const isHindi = lang === 'hindi';

    const newspapers = await prisma.eNewspaper.findMany({
        where: { language: isHindi ? "HINDI" : "ENGLISH" },
        orderBy: { publishDate: "desc" },
    });

    const serializedNewspapers = newspapers.map(n => ({
        id: n.id,
        titleEn: n.titleEn,
        titleHi: n.titleHi,
        language: n.language,
        publishDate: n.publishDate, // Pass as string? the client will receive it as ISO string from Server Component
        pdfUrl: n.pdfUrl
    }));

    // We evaluate Hindi based on the URL lang param now

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text)] transition-colors">
            {/* Custom Standalone Navbar */}
            <header className="bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="TheKaalchakra Logo" width={40} height={40} className="w-10 h-10 object-contain" />
                        <span className="font-serif font-bold text-xl text-[var(--color-text)] tracking-tight">TheKaalchakra <span className="text-[var(--color-primary)] font-sans font-medium text-lg ml-1">E-Paper</span></span>
                    </Link>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <LanguageToggle lang={lang as any} />
                        <Link href="/" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors hidden sm:block">
                            {isHindi ? "मुख्य वेबसाइट पर जाएं" : "Go to Main Website"} &rarr;
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">
                        {isHindi ? "सभी ई-अखबार" : "All E-Papers"}
                    </h1>
                </div>

                {/* Client Component for the Grid (handles react-pdf and sharing) */}
                <EPaperClient papers={serializedNewspapers as any} isHindi={isHindi} />
            </main>
        </div>
    );
}

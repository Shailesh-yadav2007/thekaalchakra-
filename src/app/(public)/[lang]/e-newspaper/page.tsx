import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { FileText, Calendar } from "lucide-react";

interface ENewspaperPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ENewspaperPageProps): Promise<Metadata> {
    const { lang } = await params;
    const isHindi = lang === "hindi";

    return {
        title: isHindi ? `ई-समाचार पत्र | ${siteConfig.nameHi}` : `E-Newspaper | ${siteConfig.name}`,
        description: isHindi ? "नवीनतम ई-समाचार पत्र पढ़ें" : "Read the latest e-newspapers",
    };
}

export default async function ENewspaperPage({ params }: ENewspaperPageProps) {
    const { lang } = await params;
    const isHindi = lang === "hindi";
    const languageEnum = isHindi ? "HINDI" : "ENGLISH";

    const newspapers = await prisma.eNewspaper.findMany({
        where: { language: languageEnum },
        orderBy: { publishDate: "desc" },
    });

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8 border-b pb-4">
                {isHindi ? "ई-समाचार पत्र" : "E-Newspaper"}
            </h1>

            {newspapers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                        {isHindi
                            ? "अभी कोई ई-समाचार पत्र उपलब्ध नहीं है।"
                            : "No e-newspapers available yet."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newspapers.map((paper: typeof newspapers[number]) => (
                        <div key={paper.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {paper.publishDate.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <h2 className={`text-xl font-bold mb-4 line-clamp-2 ${isHindi ? 'font-hindi' : ''}`}>
                                    {isHindi ? paper.titleHi : paper.titleEn}
                                </h2>

                                <a
                                    href={paper.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded transition-colors"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    {isHindi ? "पीडीएफ पढ़ें" : "Read PDF"}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

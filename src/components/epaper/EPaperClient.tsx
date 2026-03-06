"use client";

import { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure worker strictly on client side to avoid DOMMatrix SSR errors
if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface EPaperProps {
    id: string;
    titleEn: string;
    titleHi: string;
    language: string;
    publishDate: Date;
    pdfUrl: string;
}

export function EPaperClient({ papers, isHindi }: { papers: EPaperProps[], isHindi: boolean }) {
    const handleShare = async (paper: EPaperProps) => {
        const title = isHindi ? paper.titleHi : paper.titleEn;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `TheKaalchakra E-Paper: ${title}`,
                    text: `Read the ${title} E-Paper on TheKaalchakra`,
                    url: paper.pdfUrl,
                });
            } catch (error) {
                console.error("Error sharing", error);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(paper.pdfUrl);
            alert(isHindi ? "लिंक कॉपी हो गया!" : "Link copied to clipboard!");
        }
    };

    if (papers.length === 0) {
        return (
            <div className="flex items-center justify-center p-12 text-[var(--color-text-secondary)]">
                {isHindi ? "कोई ई-अखबार उपलब्ध नहीं है।" : "No e-papers available."}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 mx-auto max-w-7xl">
            {papers.map((paper) => (
                <div key={paper.id} className="bg-[var(--color-bg)] rounded-lg shadow-sm border border-[var(--color-border-light)] overflow-hidden flex flex-col group transition-all hover:shadow-md">
                    {/* PDF Thumbnail */}
                    <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-full bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-light)] aspect-[3/4] overflow-hidden group-hover:opacity-95 transition-opacity"
                    >
                        <Document
                            file={paper.pdfUrl}
                            loading={
                                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                                    Loading cover...
                                </div>
                            }
                            error={
                                <div className="absolute inset-0 flex items-center justify-center text-sm text-red-400">
                                    Viewer Error
                                </div>
                            }
                            className="w-full flex justify-center h-full"
                        >
                            <Page
                                pageNumber={1}
                                width={300} // Approximate width to fit grid 
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                loading=""
                                className="shadow-sm max-w-full"
                            />
                        </Document>
                    </a>

                    {/* Paper Title */}
                    <div className="px-4 pt-4 pb-1">
                        <h2 className={`text-lg font-bold leading-tight text-[var(--color-text)] line-clamp-2 ${isHindi ? 'font-hindi' : ''}`}>
                            {isHindi ? paper.titleHi : paper.titleEn}
                        </h2>
                    </div>

                    {/* Meta Footer */}
                    <div className="p-4 bg-[var(--color-bg)] flex items-center justify-between mt-auto">
                        <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                            {new Date(paper.publishDate).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            }).replace(/\//g, '-')}
                        </div>
                        <button
                            onClick={() => handleShare(paper)}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors"
                            aria-label="Share"
                            title={isHindi ? "शेयर करें" : "Share"}
                        >
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

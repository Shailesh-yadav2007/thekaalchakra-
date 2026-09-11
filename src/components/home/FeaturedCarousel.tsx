"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SupportedLanguage } from "@/lib/utils";

interface FeaturedArticle {
    id: string;
    titleEn: string | null;
    titleHi: string | null;
    slugEn: string | null;
    slugHi: string | null;
    excerptEn: string | null;
    excerptHi: string | null;
    featuredImage: string | null;
    isBreaking: boolean;
    publishedAt: Date | string | null;
    author: {
        name: string;
    };
    category: {
        nameEn: string;
        nameHi: string;
        slugEn: string;
        slugHi: string;
    };
}

interface FeaturedCarouselProps {
    articles: FeaturedArticle[];
    lang: SupportedLanguage;
}

export function FeaturedCarousel({ articles, lang }: FeaturedCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const isHindi = lang === "hindi";

    // Auto-advance slide every 6 seconds
    useEffect(() => {
        if (articles.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % articles.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [articles.length]);

    if (!articles || articles.length === 0) return null;

    const current = articles[currentIndex];
    const title = (isHindi ? current.titleHi : current.titleEn) || "";
    const excerpt = (isHindi ? current.excerptHi : current.excerptEn) || "";
    const slug = (isHindi ? current.slugHi : current.slugEn) || "";
    const catSlug = (isHindi ? current.category.slugHi : current.category.slugEn) || "news";

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
    };

    return (
        <div className="featured-carousel-wrapper">
            <div className="carousel-slide-container">
                {/* Background Hero Image */}
                {current.featuredImage ? (
                    <img
                        src={current.featuredImage}
                        alt={title}
                        className="carousel-hero-img"
                    />
                ) : (
                    <div className="carousel-hero-fallback" />
                )}

                {/* Gradient Scrim Overlay */}
                <div className="carousel-scrim-overlay" />

                {/* Top-Left LIVE Badge */}
                <div className="carousel-top-badge">
                    <span className="badge-live-hero">LIVE</span>
                </div>

                {/* Overlaid Headline & Subhead Content */}
                <div className="carousel-content-overlay">
                    <h2 className="carousel-title">
                        <Link href={`/${lang}/${catSlug}/${slug}`}>
                            {title}
                        </Link>
                    </h2>

                    {excerpt && <p className="carousel-excerpt">{excerpt}</p>}

                    {/* Byline Row */}
                    <div className="carousel-byline-row">
                        <div className="author-mark">K</div>
                        <span className="byline-author">
                            {current.author?.name || "The Kaalchakra News Desk"}
                        </span>
                        <span className="byline-dot">•</span>
                        <span className="byline-date">2 July 2026</span>
                        <span className="byline-dot">•</span>
                        <span className="byline-readtime">10 min read</span>
                    </div>
                </div>

                {/* Bottom-Right Pagination & Arrow Controls */}
                <div className="carousel-controls">
                    <span className="carousel-counter">
                        {currentIndex + 1} / {articles.length}
                    </span>
                    <button
                        onClick={handlePrev}
                        className="carousel-arrow-btn"
                        aria-label="Previous Slide"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="carousel-arrow-btn"
                        aria-label="Next Slide"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

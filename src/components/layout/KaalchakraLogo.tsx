"use client";

import Link from "next/link";
import type { SupportedLanguage } from "@/lib/utils";

interface KaalchakraLogoProps {
    lang?: SupportedLanguage;
    size?: "sm" | "md" | "lg";
    showTagline?: boolean;
    className?: string;
}

export function KaalchakraLogo({
    lang = "hindi",
    size = "md",
    showTagline = true,
    className = "",
}: KaalchakraLogoProps) {
    const isHindi = lang === "hindi";

    // Dimensions mapping
    const dimensions = {
        sm: { emblemSize: 36, titleClass: "text-lg", tagClass: "text-[10px]" },
        md: { emblemSize: 46, titleClass: "text-2xl", tagClass: "text-xs" },
        lg: { emblemSize: 60, titleClass: "text-3xl", tagClass: "text-sm" },
    }[size];

    return (
        <Link href={`/${lang}`} className={`kaalchakra-brand-container group flex items-center gap-3 ${className}`}>
            {/* Emblem with rotating outer gear wheel */}
            <div className="relative flex items-center justify-center shrink-0" style={{ width: dimensions.emblemSize, height: dimensions.emblemSize }}>
                {/* Rotating Outer Wheel SVG */}
                <svg
                    viewBox="0 0 100 100"
                    className="kaalchakra-gear-ring absolute inset-0 w-full h-full text-[var(--color-primary)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Outer Circle with Spokes (Gear/Chakra representation) */}
                    <circle cx="50" cy="50" r="44" strokeWidth="4" />
                    <circle cx="50" cy="50" r="36" strokeWidth="1.5" strokeDasharray="3 3" />
                    {/* 12 Spokes radiating from center */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                        <line
                            key={angle}
                            x1="50"
                            y1="50"
                            x2={50 + 44 * Math.cos((angle * Math.PI) / 180)}
                            y2={50 + 44 * Math.sin((angle * Math.PI) / 180)}
                            strokeWidth="2.5"
                        />
                    ))}
                    {/* Small Gear Teeth on Outer Edge */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                        <circle
                            key={`tooth-${angle}`}
                            cx={50 + 46 * Math.cos((angle * Math.PI) / 180)}
                            cy={50 + 46 * Math.sin((angle * Math.PI) / 180)}
                            r="3"
                            fill="currentColor"
                        />
                    ))}
                </svg>

                {/* Inner Central Hub (Stable, Stationary) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[var(--color-primary)] text-white font-serif font-black flex items-center justify-center text-[10px] md:text-xs shadow-sm">
                        क
                    </div>
                </div>
            </div>

            {/* Wordmark & Tagline (Completely Stationary) */}
            <div className="flex flex-col">
                <span className={`masthead-wordmark font-serif font-extrabold tracking-tight text-[var(--color-text)] ${dimensions.titleClass}`}>
                    {isHindi ? "द कालचक्र" : "The Kaalchakra"}
                </span>
                {showTagline && (
                    <span className={`masthead-tagline-text font-sans font-medium text-[var(--color-text-muted)] tracking-wider ${dimensions.tagClass}`}>
                        {isHindi ? "खबर नहीं, दृष्टिकोण" : "Not Just News, The Viewpoint"}
                    </span>
                )}
            </div>
        </Link>
    );
}

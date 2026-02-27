import { type ClassValue, clsx } from "clsx";

/**
 * Merge Tailwind class names, handling conflicts.
 * Lightweight alternative to tailwind-merge for now.
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/**
 * Format a date for display.
 */
export function formatDate(date: Date | string, lang: "hindi" | "english" = "english"): string {
    const d = new Date(date);
    const locale = lang === "hindi" ? "hi-IN" : "en-IN";
    return d.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Generate a URL-friendly slug from a string.
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

/**
 * Truncate text to a given length.
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length).trim() + "...";
}

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = ["hindi", "english"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Check if a string is a valid language param.
 */
export function isValidLanguage(lang: string): lang is SupportedLanguage {
    return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

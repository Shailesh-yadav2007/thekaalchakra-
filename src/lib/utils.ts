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
 * Transliterate Hindi (Devanagari) text to a Roman slug.
 */
const DEVANAGARI_MAP: Record<string, string> = {
    // Multi-character sequences MUST come first
    "क्ष": "ksh", "ज्ञ": "gya",
    "ढ़": "rh", "ड़": "r", "ज़": "z", "फ़": "f", "क़": "q", "ख़": "kh", "ग़": "gh",
    "अं": "an", "अः": "ah",
    // Single vowels
    "अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo",
    "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au",
    // Consonants
    "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "ng",
    "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "ny",
    "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n",
    "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
    "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m",
    "य": "y", "र": "r", "ल": "l", "व": "v",
    "श": "sh", "ष": "sh", "स": "s", "ह": "h", "ळ": "l",
    // Matras (vowel signs)
    "ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo",
    "े": "e", "ै": "ai", "ो": "o", "ौ": "au",
    "ं": "n", "ः": "h", "्": "",
    // Numerals
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
    "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
};

const CONSONANTS = new Set([
    "क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ",
    "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न",
    "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व",
    "श", "ष", "स", "ह", "ळ", "ड़", "ढ़",
]);

const MATRAS_AND_HALANT = new Set([
    "ा", "ि", "ी", "ु", "ू", "े", "ै", "ो", "ौ", "ं", "ः", "्", "़",
]);

export function slugifyHindi(text: string): string {
    let result = "";
    // Handle multi-char sequences first
    let processed = text;
    for (const seq of ["क्ष", "ज्ञ", "ढ़", "ड़", "अं", "अः"]) {
        processed = processed.split(seq).join(DEVANAGARI_MAP[seq]);
    }

    for (let i = 0; i < processed.length; i++) {
        const char = processed[i];
        const nextChar = processed[i + 1];
        const mapped = DEVANAGARI_MAP[char];

        if (mapped !== undefined) {
            result += mapped;
            // Add inherent 'a' for consonants not followed by matra/halant
            if (CONSONANTS.has(char) && !MATRAS_AND_HALANT.has(nextChar)) {
                result += "a";
            }
        } else {
            result += char;
        }
    }
    return slugify(result);
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

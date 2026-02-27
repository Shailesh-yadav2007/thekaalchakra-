import { z } from "zod";

// ─── Auth ───────────────────────────────────────────────────────────

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["OWNER", "ADMIN", "EDITOR", "REPORTER"]),
});

// ─── Article ────────────────────────────────────────────────────────

export const articleSchema = z.object({
    titleEn: z.string().optional(),
    titleHi: z.string().optional(),
    excerptEn: z.string().max(300, "Excerpt too long").optional(),
    excerptHi: z.string().max(300, "Excerpt too long").optional(),
    bodyEn: z.string().optional(),
    bodyHi: z.string().optional(),
    featuredImage: z.string().url().optional().or(z.literal("")),
    categoryId: z.string().min(1, "Category is required"),
    tagIds: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    isBreaking: z.boolean().optional(),
    metaTitleEn: z.string().max(70).optional(),
    metaTitleHi: z.string().max(70).optional(),
    metaDescEn: z.string().max(160).optional(),
    metaDescHi: z.string().max(160).optional(),
    status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED"]).optional(),
}).refine(
    (data) => data.titleEn || data.titleHi,
    { message: "At least one title (English or Hindi) is required" }
);

// ─── Category ───────────────────────────────────────────────────────

export const categorySchema = z.object({
    nameEn: z.string().min(1, "English name is required"),
    nameHi: z.string().min(1, "Hindi name is required"),
    slugEn: z.string().min(1, "English slug is required"),
    slugHi: z.string().min(1, "Hindi slug is required"),
    sortOrder: z.number().int().optional(),
});

// ─── Comment ────────────────────────────────────────────────────────

export const commentSchema = z.object({
    authorName: z.string().min(1, "Name is required"),
    authorEmail: z.string().email("Invalid email").optional(),
    body: z.string().min(1, "Comment cannot be empty").max(2000, "Comment too long"),
    articleId: z.string().min(1, "Article ID is required"),
});

// ─── E-Newspaper ────────────────────────────────────────────────────

export const eNewspaperSchema = z.object({
    titleEn: z.string().min(1, "English title is required"),
    titleHi: z.string().min(1, "Hindi title is required"),
    language: z.enum(["HINDI", "ENGLISH"]),
    pdfUrl: z.string().url("Valid PDF URL is required"),
    publishDate: z.string().datetime().or(z.date()),
});

// ─── Type exports ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type ENewspaperInput = z.infer<typeof eNewspaperSchema>;

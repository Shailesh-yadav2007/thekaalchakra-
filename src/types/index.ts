// ─── Role & Status types ────────────────────────────────────────────

export type UserRole = "OWNER" | "ADMIN" | "EDITOR" | "REPORTER";
export type ArticleStatusType = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type LanguageType = "HINDI" | "ENGLISH";

// ─── Base model types ───────────────────────────────────────────────

export interface User {
    id: string;
    name: string;
    email: string;
    hashedPassword: string;
    role: UserRole;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    nameEn: string;
    nameHi: string;
    slugEn: string;
    slugHi: string;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Article {
    id: string;
    titleEn: string | null;
    titleHi: string | null;
    slugEn: string | null;
    slugHi: string | null;
    excerptEn: string | null;
    excerptHi: string | null;
    bodyEn: string | null;
    bodyHi: string | null;
    featuredImage: string | null;
    status: ArticleStatusType;
    isFeatured: boolean;
    isBreaking: boolean;
    metaTitleEn: string | null;
    metaTitleHi: string | null;
    metaDescEn: string | null;
    metaDescHi: string | null;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    editorId: string | null;
    categoryId: string;
}

export interface Tag {
    id: string;
    nameEn: string;
    nameHi: string;
    slug: string;
}

export interface Comment {
    id: string;
    authorName: string;
    authorEmail: string | null;
    body: string;
    approved: boolean;
    createdAt: Date;
    articleId: string;
}

export interface ENewspaper {
    id: string;
    titleEn: string;
    titleHi: string;
    language: LanguageType;
    pdfUrl: string;
    publishDate: Date;
    createdAt: Date;
}

// ─── Extended types with relations ──────────────────────────────────

export type ArticleWithRelations = Article & {
    author: Pick<User, "id" | "name" | "avatarUrl">;
    editor?: Pick<User, "id" | "name"> | null;
    category: Category;
    tags: { tag: Tag }[];
    comments?: Comment[];
    _count?: { comments: number };
};

export type CategoryWithCount = Category & {
    _count: { articles: number };
};

// ─── API / Form types ───────────────────────────────────────────────

export interface ArticleFormData {
    titleEn?: string;
    titleHi?: string;
    excerptEn?: string;
    excerptHi?: string;
    bodyEn?: string;
    bodyHi?: string;
    featuredImage?: string;
    categoryId: string;
    tagIds?: string[];
    isFeatured?: boolean;
    isBreaking?: boolean;
    metaTitleEn?: string;
    metaTitleHi?: string;
    metaDescEn?: string;
    metaDescHi?: string;
    status?: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED";
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ─── Navigation ─────────────────────────────────────────────────────

export interface NavItem {
    label: string;
    labelHi: string;
    href: string;
    children?: NavItem[];
}

// ─── Auth ───────────────────────────────────────────────────────────

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

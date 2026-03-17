import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { articleSchema } from "@/lib/validations";
import { slugify, slugifyHindi } from "@/lib/utils";
import { notifyAdminsAndOwners, notifyEditors } from "@/lib/notifications";
import { sendPushToAll } from "@/lib/webpush";

// GET /api/articles - List articles
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const status = searchParams.get("status") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;

    const where: any = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const [articles, total] = await Promise.all([
        prisma.article.findMany({
            where,
            include: {
                author: { select: { id: true, name: true } },
                category: true,
                tags: { include: { tag: true } },
                _count: { select: { comments: true } },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.article.count({ where }),
    ]);

    return NextResponse.json({
        data: articles,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    });
}

// POST /api/articles - Create article
export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = articleSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            { error: "Validation failed", details: validation.error.flatten() },
            { status: 400 }
        );
    }

    const data = validation.data;
    const userRole = (session.user as any).role;

    // Reporters and Editors can only create drafts or submit for review
    if ((userRole === "REPORTER" || userRole === "EDITOR") && data.status === "PUBLISHED") {
        data.status = "PENDING_REVIEW";
    }

    // Generate slugs with uniqueness check + retry on constraint violation
    const generateSlugs = async () => {
        let slugEn: string | null = null;
        if (data.titleEn) {
            const base = slugify(data.titleEn);
            const existing = await prisma.article.findUnique({ where: { slugEn: base }, select: { id: true } });
            slugEn = existing ? `${base}-${Date.now()}` : base;
        }
        let slugHi: string | null = null;
        if (data.titleHi) {
            const rawSlugHi = typeof body.slugHi === "string" ? slugifyHindi(body.slugHi) : "";
            const base = rawSlugHi || slugifyHindi(data.titleHi) || `hi-${Date.now()}`;
            const existing = await prisma.article.findUnique({ where: { slugHi: base }, select: { id: true } });
            slugHi = existing ? `${base}-${Date.now()}` : base;
        }
        return { slugEn, slugHi };
    };

    let article!: Awaited<ReturnType<typeof prisma.article.create>>;
    for (let attempt = 0; attempt < 3; attempt++) {
        const { slugEn, slugHi } = await generateSlugs();
        try {
            article = await prisma.article.create({
                data: {
                    titleEn: data.titleEn,
                    titleHi: data.titleHi,
                    slugEn,
                    slugHi,
                    excerptEn: data.excerptEn,
                    excerptHi: data.excerptHi,
                    bodyEn: data.bodyEn,
                    bodyHi: data.bodyHi,
                    featuredImage: data.featuredImage || null,
                    categoryId: data.categoryId,
                    authorId: (session.user as any).id,
                    status: data.status || "DRAFT",
                    isFeatured: data.isFeatured || false,
                    isBreaking: data.isBreaking || false,
                    metaTitleEn: data.metaTitleEn,
                    metaTitleHi: data.metaTitleHi,
                    metaDescEn: data.metaDescEn,
                    metaDescHi: data.metaDescHi,
                    publishedAt: data.status === "PUBLISHED" ? new Date() : null,
                },
            });
            break;
        } catch (err: unknown) {
            const code = (err as { code?: string })?.code;
            if (code === "P2002" && attempt < 2) continue;
            throw err;
        }
    }

    // Fire notifications (non-blocking)
    const articleTitle = data.titleEn || data.titleHi || "Untitled";
    const authorName = (session.user as any).name || "A reporter";
    const finalStatus = data.status || "DRAFT";

    if (finalStatus === "PENDING_REVIEW") {
        notifyAdminsAndOwners(
            `${authorName} submitted "${articleTitle}" for review`,
            "REVIEW_REQUEST",
            article.id
        ).catch(() => {});
    }

    if (finalStatus !== "DRAFT") {
        notifyEditors(
            `New article "${articleTitle}" by ${authorName}`,
            "NEW_ARTICLE",
            article.id
        ).catch(() => {});
    }

    // Push notification to readers when directly published (fire-and-forget)
    if (finalStatus === "PUBLISHED") {
        (async () => {
            const category = await prisma.category.findUnique({ where: { id: data.categoryId }, select: { slugEn: true, slugHi: true } });
            const articleSlug = article.slugEn || article.slugHi;
            const pushLang = article.slugEn ? "english" : "hindi";
            const categorySlug = article.slugEn ? category?.slugEn : category?.slugHi;
            if (articleSlug && categorySlug) {
                await sendPushToAll({
                    title: articleTitle,
                    body: article.excerptEn || article.excerptHi || "New article on TheKaalchakra",
                    url: `/${pushLang}/${categorySlug}/${articleSlug}`,
                });
            }
        })().catch(() => {});
    }

    return NextResponse.json(article, { status: 201 });
}

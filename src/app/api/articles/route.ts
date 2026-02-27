import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { articleSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

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

    // Reporters can only create drafts
    if (userRole === "REPORTER" && data.status === "PUBLISHED") {
        data.status = "PENDING_REVIEW";
    }

    const article = await prisma.article.create({
        data: {
            titleEn: data.titleEn,
            titleHi: data.titleHi,
            slugEn: data.titleEn ? slugify(data.titleEn) : null,
            slugHi: data.titleHi ? (body.slugHi || `hi-${Date.now()}`) : null,
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

    return NextResponse.json(article, { status: 201 });
}

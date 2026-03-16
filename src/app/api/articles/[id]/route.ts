import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyAdminsAndOwners, notifyEditors, notifyUser } from "@/lib/notifications";

// GET /api/articles/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const article = await prisma.article.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, name: true } },
            editor: { select: { id: true, name: true } },
            category: true,
            tags: { include: { tag: true } },
            comments: true,
        },
    });

    if (!article) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(article);
}

// PUT /api/articles/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const userRole = (session.user as any).role;

        // Check article existence for all users
        const existing = await prisma.article.findUnique({
            where: { id },
            select: { authorId: true, publishedAt: true, status: true, titleEn: true, titleHi: true },
        });

        if (!existing) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Reporters can only edit their own articles
        if (userRole === "REPORTER") {
            if (existing.authorId !== (session.user as any).id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        // Reporters and Editors cannot publish
        if ((userRole === "REPORTER" || userRole === "EDITOR") && body.status === "PUBLISHED") {
            body.status = "PENDING_REVIEW";
        }

        // Prevent mass assignment vulnerability explicitly mapping allowed fields
        const {
            titleEn, titleHi, slugEn, slugHi, excerptEn, excerptHi,
            bodyEn, bodyHi, featuredImage, categoryId, status,
            isFeatured, isBreaking, metaTitleEn, metaTitleHi,
            metaDescEn, metaDescHi
        } = body;

        const updateData: Record<string, any> = {};
        if (titleEn !== undefined) updateData.titleEn = titleEn;
        if (titleHi !== undefined) updateData.titleHi = titleHi;
        if (slugEn !== undefined) updateData.slugEn = slugEn || null;
        if (slugHi !== undefined) updateData.slugHi = slugHi || null;
        if (excerptEn !== undefined) updateData.excerptEn = excerptEn;
        if (excerptHi !== undefined) updateData.excerptHi = excerptHi;
        if (bodyEn !== undefined) updateData.bodyEn = bodyEn;
        if (bodyHi !== undefined) updateData.bodyHi = bodyHi;
        if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (status !== undefined) updateData.status = status;
        if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
        if (isBreaking !== undefined) updateData.isBreaking = isBreaking;
        if (metaTitleEn !== undefined) updateData.metaTitleEn = metaTitleEn;
        if (metaTitleHi !== undefined) updateData.metaTitleHi = metaTitleHi;
        if (metaDescEn !== undefined) updateData.metaDescEn = metaDescEn;
        if (metaDescHi !== undefined) updateData.metaDescHi = metaDescHi;

        // Only Admin or Owner can actually publish via the PUT logic above.
        // Record editor and set publishedAt only on first publish (never overwrite existing date)
        if (body.status === "PUBLISHED" && (userRole === "ADMIN" || userRole === "OWNER")) {
            updateData.editorId = (session.user as any).id;
            if (!existing.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }

        const article = await prisma.article.update({
            where: { id },
            data: updateData,
        });

        // Fire notifications (non-blocking)
        const articleTitle = body.titleEn || existing.titleEn || body.titleHi || existing.titleHi || "Untitled";
        const authorName = (session.user as any).name || "Someone";

        // Article submitted for review (status changed to PENDING_REVIEW)
        if (body.status === "PENDING_REVIEW" && existing.status !== "PENDING_REVIEW") {
            notifyAdminsAndOwners(
                `${authorName} submitted "${articleTitle}" for review`,
                "REVIEW_REQUEST",
                article.id
            ).catch(() => {});

            notifyEditors(
                `New article "${articleTitle}" by ${authorName} needs editing`,
                "NEW_ARTICLE",
                article.id
            ).catch(() => {});
        }

        // Article published — notify the author
        if (body.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
            notifyUser(
                existing.authorId,
                `Your article "${articleTitle}" has been published!`,
                "PUBLISHED",
                article.id
            ).catch(() => {});
        }

        return NextResponse.json(article);
    } catch (error: any) {
        console.error("PUT /api/articles/[id] Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/articles/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;

    // Only OWNER and ADMIN can delete articles
    if (userRole !== "OWNER" && userRole !== "ADMIN") {
        return NextResponse.json({ error: "Only Owner and Admin can delete articles" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

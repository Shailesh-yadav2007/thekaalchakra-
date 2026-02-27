import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const userRole = (session.user as any).role;

    // Reporters can only edit their own articles
    if (userRole === "REPORTER") {
        const existing = await prisma.article.findUnique({
            where: { id },
            select: { authorId: true },
        });
        if (existing?.authorId !== (session.user as any).id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        // Reporters cannot publish
        if (body.status === "PUBLISHED") {
            body.status = "PENDING_REVIEW";
        }
    }

    // Set editor and publishedAt
    const updateData: any = { ...body };
    if (body.status === "PUBLISHED" && (userRole === "EDITOR" || userRole === "ADMIN" || userRole === "OWNER")) {
        updateData.editorId = (session.user as any).id;
        updateData.publishedAt = new Date();
    }

    const article = await prisma.article.update({
        where: { id },
        data: updateData,
    });

    return NextResponse.json(article);
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

    // Reporters cannot delete anything
    if (userRole === "REPORTER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Editors can only delete DRAFT articles
    if (userRole === "EDITOR") {
        const article = await prisma.article.findUnique({
            where: { id },
            select: { status: true },
        });
        if (!article) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        if (article.status !== "DRAFT") {
            return NextResponse.json(
                { error: "Editors can only delete draft articles" },
                { status: 403 }
            );
        }
    }

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

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
    }

    // Reporters and Editors cannot publish
    if ((userRole === "REPORTER" || userRole === "EDITOR") && body.status === "PUBLISHED") {
        body.status = "PENDING_REVIEW";
    }

    // Set editor and publishedAt
    const updateData: any = { ...body };
    delete updateData.authorId; // Never allow updating the original author via PUT

    // Only Admin or Owner can actually publish via the PUT logic above.
    // If the status is PUBLISHED, we record who acted as the editor (publisher) and the time
    if (body.status === "PUBLISHED" && (userRole === "ADMIN" || userRole === "OWNER")) {
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

    // Only OWNER and ADMIN can delete articles
    if (userRole !== "OWNER" && userRole !== "ADMIN") {
        return NextResponse.json({ error: "Only Owner and Admin can delete articles" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

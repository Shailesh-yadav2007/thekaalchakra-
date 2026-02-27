import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations";

// POST /api/comments - Submit a comment
export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = commentSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            { error: "Validation failed", details: validation.error.flatten() },
            { status: 400 }
        );
    }

    const comment = await prisma.comment.create({
        data: {
            authorName: validation.data.authorName,
            authorEmail: validation.data.authorEmail,
            body: validation.data.body,
            articleId: validation.data.articleId,
            approved: false, // Requires moderation
        },
    });

    return NextResponse.json(comment, { status: 201 });
}

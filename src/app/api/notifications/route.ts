import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/notifications
export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";

    const where: any = { userId };
    if (unreadOnly) where.read = false;

    const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            article: { select: { id: true, titleEn: true, titleHi: true } },
        },
    });

    const unreadCount = await prisma.notification.count({
        where: { userId, read: false },
    });

    return NextResponse.json({ notifications, unreadCount });
}

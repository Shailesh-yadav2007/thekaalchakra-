import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH /api/notifications/read-all — mark all as read
export async function PATCH() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
    });

    return NextResponse.json({ success: true });
}

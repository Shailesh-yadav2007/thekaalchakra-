import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// DELETE /api/e-newspaper/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const callerRole = (session?.user as any)?.role;

    if (!session?.user || (callerRole !== "OWNER" && callerRole !== "ADMIN")) {
        return NextResponse.json({ error: "Only Owner and Admin can delete E-Newspapers" }, { status: 403 });
    }

    const { id } = await params;

    const paper = await prisma.eNewspaper.findUnique({
        where: { id },
        select: { id: true },
    });

    if (!paper) {
        return NextResponse.json({ error: "E-Newspaper not found" }, { status: 404 });
    }

    await prisma.eNewspaper.delete({ where: { id } });

    return NextResponse.json({ success: true });
}

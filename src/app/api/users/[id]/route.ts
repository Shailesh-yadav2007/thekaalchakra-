import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
    role: z.enum(["ADMIN", "EDITOR", "REPORTER"]).optional(),
    name: z.string().min(2).optional(),
});

// PATCH /api/users/[id] — update role or name (Owner/Admin only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const callerRole = (session?.user as any)?.role;
    const callerId = (session?.user as any)?.id;

    if (!session?.user || (callerRole !== "OWNER" && callerRole !== "ADMIN")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    // Cannot edit yourself
    if (id === callerId) {
        return NextResponse.json({ error: "Cannot modify your own role" }, { status: 400 });
    }

    // Admin cannot promote to Owner or Admin
    if (callerRole === "ADMIN" && (parsed.data.role === "ADMIN" as string)) {
        return NextResponse.json({ error: "Admins cannot assign Owner or Admin roles" }, { status: 403 });
    }

    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Admin cannot edit an Owner or Admin
    if (callerRole === "ADMIN" && (target.role === "OWNER" || target.role === "ADMIN")) {
        return NextResponse.json({ error: "Admins cannot modify Owner or Admin users" }, { status: 403 });
    }

    const user = await prisma.user.update({
        where: { id },
        data: parsed.data,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(user);
}

// DELETE /api/users/[id] — delete user (Owner only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const callerRole = (session?.user as any)?.role;
    const callerId = (session?.user as any)?.id;

    if (!session?.user || callerRole !== "OWNER") {
        return NextResponse.json({ error: "Only Owner can delete users" }, { status: 403 });
    }

    const { id } = await params;

    if (id === callerId) {
        return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

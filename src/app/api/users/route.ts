import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["ADMIN", "EDITOR", "REPORTER"]),
});

// GET /api/users — list all users (Owner/Admin only)
export async function GET() {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session?.user || (role !== "OWNER" && role !== "ADMIN")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: { select: { authoredArticles: true } },
        },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(users);
}

// POST /api/users — create a new user (Owner/Admin only)
export async function POST(request: NextRequest) {
    const session = await auth();
    const callerRole = (session?.user as any)?.role;

    if (!session?.user || (callerRole !== "OWNER" && callerRole !== "ADMIN")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    // Admin cannot create Owner or another Admin (only Owner can)
    if (callerRole === "ADMIN" && (role === "ADMIN" as string)) {
        return NextResponse.json({ error: "Admins can only create Editors or Reporters" }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: { name, email, hashedPassword, role },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
}

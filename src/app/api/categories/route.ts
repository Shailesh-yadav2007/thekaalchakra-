import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

// GET /api/categories
export async function GET() {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { articles: true } } },
    });

    return NextResponse.json(categories);
}

// POST /api/categories
export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "OWNER" && role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            { error: "Validation failed", details: validation.error.flatten() },
            { status: 400 }
        );
    }

    const category = await prisma.category.create({
        data: validation.data,
    });

    return NextResponse.json(category, { status: 201 });
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UsersClient } from "@/components/admin/UsersClient";

export default async function UsersPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    const id = (session?.user as any)?.id;

    if (role !== "OWNER" && role !== "ADMIN") {
        redirect("/admin");
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

    // Serialize dates for client component
    const serialized = users.map(u => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
    }));

    return (
        <UsersClient
            users={serialized as any}
            currentUserId={id}
            currentUserRole={role}
        />
    );
}

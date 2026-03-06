import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ENewspaperClient } from "@/components/admin/ENewspaperClient";

export default async function ENewspaperAdminPage() {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    const newspapers = await prisma.eNewspaper.findMany({
        orderBy: { publishDate: "desc" },
    });

    const serializedNewspapers = newspapers.map(paper => ({
        ...paper,
        publishDate: paper.publishDate.toISOString(),
    }));

    return (
        <ENewspaperClient initialNewspapers={serializedNewspapers} userRole={userRole} />
    );
}

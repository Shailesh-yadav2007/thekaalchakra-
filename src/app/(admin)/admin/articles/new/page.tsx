import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { auth } from "@/lib/auth";

export default async function NewArticlePage() {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
    });

    const tags = await prisma.tag.findMany({
        orderBy: { nameEn: "asc" },
    });

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Create New Article</h1>
            </div>
            <ArticleForm categories={categories} tags={tags} userRole={userRole} />
        </div>
    );
}

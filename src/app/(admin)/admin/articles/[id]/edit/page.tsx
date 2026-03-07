import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { auth } from "@/lib/auth";

interface EditArticlePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    const { id } = await params;

    const [article, categories, tags] = await Promise.all([
        prisma.article.findUnique({
            where: { id },
            include: { tags: { include: { tag: true } } },
        }),
        prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.tag.findMany({ orderBy: { nameEn: "asc" } }),
    ]);

    if (!article) notFound();

    if (userRole === "REPORTER" && article.authorId !== (session?.user as any)?.id) {
        // Redirect or show a 404 page
        notFound();
    }

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Edit Article</h1>
            </div>
            <ArticleForm
                article={article}
                categories={categories}
                tags={tags}
                userRole={userRole}
            />
        </div>
    );
}

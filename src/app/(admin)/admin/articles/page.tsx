import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ArticlesClient } from "@/components/admin/ArticlesClient";

export default async function ArticlesPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
    const session = await auth();
    const { status, page: pageParam, q } = await searchParams;
    const page = Math.max(1, parseInt(pageParam || "1"));
    const pageSize = 20;
    const userRole = (session?.user as any)?.role;
    const userId = (session?.user as any)?.id;

    // Build filter
    const where: any = {};
    if (status) where.status = status;
    if (q) {
        where.OR = [
            { titleEn: { contains: q, mode: "insensitive" } },
            { titleHi: { contains: q, mode: "insensitive" } },
        ];
    }
    // Reporters can only see their own articles
    if (userRole === "REPORTER") {
        where.authorId = userId;
    }

    const [articles, total] = await Promise.all([
        prisma.article.findMany({
            where,
            include: {
                author: { select: { name: true } },
                category: true,
            },
            orderBy: { updatedAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.article.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const statuses = ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"];

    // Serialize for client
    const serialized = articles.map(a => ({
        ...a,
        updatedAt: a.updatedAt.toISOString(),
        createdAt: a.createdAt.toISOString(),
        publishedAt: a.publishedAt?.toISOString() ?? null,
    }));

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Articles</h1>
                <Link href="/admin/articles/new" className="btn btn-primary">
                    <Plus size={18} />
                    New Article
                </Link>
            </div>

            {/* Filters */}
            <div className="admin-filters">
                <div className="filter-tabs">
                    <Link
                        href="/admin/articles"
                        className={`filter-tab ${!status ? "active" : ""}`}
                    >
                        All ({total})
                    </Link>
                    {statuses.map((s) => (
                        <Link
                            key={s}
                            href={`/admin/articles?status=${s}`}
                            className={`filter-tab ${status === s ? "active" : ""}`}
                        >
                            {s.replace("_", " ")}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Articles Table (client for delete) */}
            <ArticlesClient
                initialArticles={serialized as any}
                userRole={userRole}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="admin-pagination">
                    {page > 1 && (
                        <Link
                            href={`/admin/articles?page=${page - 1}${status ? `&status=${status}` : ""}`}
                            className="pagination-btn"
                        >
                            ← Previous
                        </Link>
                    )}
                    <span className="pagination-info">
                        Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                        <Link
                            href={`/admin/articles?page=${page + 1}${status ? `&status=${status}` : ""}`}
                            className="pagination-btn"
                        >
                            Next →
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

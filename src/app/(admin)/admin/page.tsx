import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
    FileText,
    Eye,
    Clock,
    MessageSquare,
    Plus,
} from "lucide-react";

export default async function AdminDashboard() {
    const session = await auth();

    const [totalArticles, publishedArticles, pendingArticles, totalComments] =
        await Promise.all([
            prisma.article.count(),
            prisma.article.count({ where: { status: "PUBLISHED" } }),
            prisma.article.count({ where: { status: "PENDING_REVIEW" } }),
            prisma.comment.count({ where: { approved: false } }),
        ]);

    const recentArticles = await prisma.article.findMany({
        include: {
            author: { select: { name: true } },
            category: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    const stats = [
        { label: "Total Articles", value: totalArticles, icon: FileText, color: "blue" },
        { label: "Published", value: publishedArticles, icon: Eye, color: "green" },
        { label: "Pending Review", value: pendingArticles, icon: Clock, color: "yellow" },
        { label: "Pending Comments", value: totalComments, icon: MessageSquare, color: "red" },
    ];

    return (
        <div className="admin-dashboard">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Dashboard</h1>
                <p className="admin-page-subtitle">
                    Welcome back, {session?.user?.name}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat) => (
                    <div key={stat.label} className={`stat-card stat-${stat.color}`}>
                        <div className="stat-icon">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <p className="stat-value">{stat.value}</p>
                            <p className="stat-label">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <Link href="/admin/articles/new" className="quick-action-btn">
                    <Plus size={18} />
                    New Article
                </Link>
            </div>

            {/* Recent Articles */}
            <div className="admin-section">
                <h2 className="admin-section-title">Recent Articles</h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentArticles.map((article: typeof recentArticles[number]) => (
                                <tr key={article.id}>
                                    <td>
                                        <Link
                                            href={`/admin/articles/${article.id}/edit`}
                                            className="table-link"
                                        >
                                            {article.titleEn || article.titleHi || "Untitled"}
                                        </Link>
                                    </td>
                                    <td>{article.category.nameEn}</td>
                                    <td>{article.author.name}</td>
                                    <td>
                                        <span className={`status-badge status-${article.status.toLowerCase()}`}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td>{article.createdAt.toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {recentArticles.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        No articles yet. Create your first article!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

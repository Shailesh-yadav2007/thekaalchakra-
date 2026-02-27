"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";

type ArticleStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";
type UserRole = "OWNER" | "ADMIN" | "EDITOR" | "REPORTER";

interface Article {
    id: string;
    titleEn: string | null;
    titleHi: string | null;
    status: ArticleStatus;
    updatedAt: string;
    category: { nameEn: string };
    author: { name: string };
}

interface Props {
    initialArticles: Article[];
    userRole: UserRole;
}

export function ArticlesClient({ initialArticles, userRole }: Props) {
    const [articles, setArticles] = useState(initialArticles);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [error, setError] = useState("");

    function canDelete(article: Article): boolean {
        if (userRole === "OWNER" || userRole === "ADMIN") return true;
        if (userRole === "EDITOR") return article.status === "DRAFT";
        return false; // REPORTER cannot delete
    }

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setDeleting(id);
        setError("");

        const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
        if (res.ok) {
            setArticles(prev => prev.filter(a => a.id !== id));
        } else {
            const data = await res.json();
            setError(data.error || "Failed to delete article");
        }
        setDeleting(null);
    }

    return (
        <>
            {error && (
                <div className="admin-error-banner">
                    {error}
                    <button onClick={() => setError("")}>✕</button>
                </div>
            )}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
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
                                    <span className={`status-badge status-${article.status.toLowerCase().replace("_", "-")}`}>
                                        {article.status.replace("_", " ")}
                                    </span>
                                </td>
                                <td>{new Date(article.updatedAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="table-actions">
                                        <Link
                                            href={`/admin/articles/${article.id}/edit`}
                                            className="table-action-btn"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        {canDelete(article) && (
                                            <button
                                                onClick={() => handleDelete(
                                                    article.id,
                                                    article.titleEn || article.titleHi || "Untitled"
                                                )}
                                                disabled={deleting === article.id}
                                                className="table-action-btn danger"
                                                title={
                                                    userRole === "EDITOR" && article.status !== "DRAFT"
                                                        ? "Editors can only delete drafts"
                                                        : "Delete article"
                                                }
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={6} className="empty-table-msg">
                                    No articles found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

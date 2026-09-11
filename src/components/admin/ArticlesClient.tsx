"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Edit, Trash2, Search, CheckCircle } from "lucide-react";

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
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        setArticles(initialArticles);
    }, [initialArticles]);

    const counts = useMemo(() => {
        const c = { ALL: articles.length, DRAFT: 0, PENDING_REVIEW: 0, PUBLISHED: 0, ARCHIVED: 0 };
        articles.forEach(a => {
            if (c[a.status] !== undefined) c[a.status]++;
        });
        return c;
    }, [articles]);

    const filteredArticles = useMemo(() => {
        return articles.filter((a) => {
            const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
            const title = (a.titleEn || a.titleHi || "").toLowerCase();
            const author = (a.author?.name || "").toLowerCase();
            const category = (a.category?.nameEn || "").toLowerCase();
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q || title.includes(q) || author.includes(q) || category.includes(q);
            return matchesStatus && matchesSearch;
        });
    }, [articles, statusFilter, searchQuery]);

    function canDelete(article: Article): boolean {
        return userRole === "OWNER" || userRole === "ADMIN";
    }

    function canPublish(): boolean {
        return userRole === "OWNER" || userRole === "ADMIN";
    }

    async function handleQuickPublish(id: string) {
        setUpdatingStatus(id);
        setError("");
        try {
            const res = await fetch(`/api/articles/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "PUBLISHED" }),
            });
            if (res.ok) {
                setArticles(prev => prev.map(a => a.id === id ? { ...a, status: "PUBLISHED" } : a));
            } else {
                const data = await res.json();
                setError(data.error || "Failed to publish article");
            }
        } catch {
            setError("Failed to connect to server");
        } finally {
            setUpdatingStatus(null);
        }
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

            {/* Filter Tabs & Search Bar */}
            <div className="admin-filter-bar flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="form-tabs" style={{ marginBottom: 0 }}>
                    <button
                        type="button"
                        className={`form-tab ${statusFilter === "ALL" ? "active" : ""}`}
                        onClick={() => setStatusFilter("ALL")}
                    >
                        All ({counts.ALL})
                    </button>
                    <button
                        type="button"
                        className={`form-tab ${statusFilter === "DRAFT" ? "active" : ""}`}
                        onClick={() => setStatusFilter("DRAFT")}
                    >
                        Drafts ({counts.DRAFT})
                    </button>
                    <button
                        type="button"
                        className={`form-tab ${statusFilter === "PENDING_REVIEW" ? "active" : ""}`}
                        onClick={() => setStatusFilter("PENDING_REVIEW")}
                    >
                        Pending Review ({counts.PENDING_REVIEW})
                    </button>
                    <button
                        type="button"
                        className={`form-tab ${statusFilter === "PUBLISHED" ? "active" : ""}`}
                        onClick={() => setStatusFilter("PUBLISHED")}
                    >
                        Published ({counts.PUBLISHED})
                    </button>
                </div>

                <div className="search-input-wrapper relative" style={{ minWidth: "240px" }}>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-input pl-9"
                    />
                </div>
            </div>

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
                        {filteredArticles.map((article) => (
                            <tr key={article.id}>
                                <td>
                                    <Link
                                        href={`/admin/articles/${article.id}/edit`}
                                        className="table-link font-medium"
                                    >
                                        {article.titleEn || article.titleHi || "Untitled"}
                                    </Link>
                                </td>
                                <td>{article.category?.nameEn || "Uncategorized"}</td>
                                <td>{article.author?.name || "Unknown"}</td>
                                <td>
                                    <span className={`status-badge status-${article.status.toLowerCase().replace("_", "-")}`}>
                                        {article.status.replace("_", " ")}
                                    </span>
                                </td>
                                <td>{new Date(article.updatedAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="table-actions">
                                        {canPublish() && article.status === "PENDING_REVIEW" && (
                                            <button
                                                onClick={() => handleQuickPublish(article.id)}
                                                disabled={updatingStatus === article.id}
                                                className="table-action-btn success"
                                                title="Approve & Publish"
                                                style={{ color: "var(--color-stock-up)" }}
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        )}
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
                                                title="Delete article"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredArticles.length === 0 && (
                            <tr>
                                <td colSpan={6} className="empty-table-msg">
                                    No articles match the current filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}


"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

interface ENewspaper {
    id: string;
    titleEn: string;
    titleHi: string;
    language: string;
    publishDate: string; // serialized
    pdfUrl: string;
}

interface ENewspaperClientProps {
    initialNewspapers: ENewspaper[];
    userRole: string;
}

export function ENewspaperClient({ initialNewspapers, userRole }: ENewspaperClientProps) {
    const [newspapers, setNewspapers] = useState(initialNewspapers);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [error, setError] = useState("");

    const canDelete = userRole === "OWNER" || userRole === "ADMIN";

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setDeleting(id);
        setError("");

        try {
            const res = await fetch(`/api/e-newspaper/${id}`, { method: "DELETE" });
            if (res.ok) {
                setNewspapers((prev) => prev.filter((n) => n.id !== id));
            } else {
                const data = await res.json();
                setError(data.error || "Failed to delete e-newspaper");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred during deletion.");
        } finally {
            setDeleting(null);
        }
    }

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">E-Newspaper Management</h1>
                <Link href="/admin/e-newspaper/create" className="btn btn-primary">
                    <Plus size={18} />
                    Upload New
                </Link>
            </div>

            {error && (
                <div className="admin-error-banner mb-4">
                    {error}
                    <button onClick={() => setError("")}>✕</button>
                </div>
            )}

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title (EN)</th>
                            <th>Title (HI)</th>
                            <th>Language</th>
                            <th>Publish Date</th>
                            <th>PDF</th>
                            {canDelete && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {newspapers.map((paper) => (
                            <tr key={paper.id}>
                                <td>{paper.titleEn}</td>
                                <td>{paper.titleHi}</td>
                                <td>
                                    <span className="status-badge">
                                        {paper.language}
                                    </span>
                                </td>
                                <td>{new Date(paper.publishDate).toLocaleDateString()}</td>
                                <td>
                                    <a
                                        href={paper.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="table-link"
                                    >
                                        View PDF
                                    </a>
                                </td>
                                {canDelete && (
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                onClick={() => handleDelete(paper.id, paper.titleEn || paper.titleHi)}
                                                disabled={deleting === paper.id}
                                                className="table-action-btn danger"
                                                title="Delete e-newspaper"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {newspapers.length === 0 && (
                            <tr>
                                <td colSpan={canDelete ? 6 : 5} className="text-center py-8 text-gray-500">
                                    No e-newspaper editions uploaded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

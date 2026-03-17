"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function CategoryForm() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [nameEn, setNameEn] = useState("");
    const [nameHi, setNameHi] = useState("");
    const [slugEn, setSlugEn] = useState("");
    const [slugHi, setSlugHi] = useState("");
    const [sortOrder, setSortOrder] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nameEn, nameHi, slugEn, slugHi, sortOrder }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to create category");
                return;
            }

            setNameEn("");
            setNameHi("");
            setSlugEn("");
            setSlugHi("");
            setSortOrder(0);
            setOpen(false);
            router.refresh();
        } catch {
            setError("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
                <Plus size={16} />
                Add Category
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">New Category</h3>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="cat-nameEn" className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Name (English)</label>
                    <input
                        id="cat-nameEn"
                        type="text"
                        value={nameEn}
                        onChange={(e) => {
                            setNameEn(e.target.value);
                            setSlugEn(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                        }}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        placeholder="e.g. Gov Scheme"
                    />
                </div>
                <div>
                    <label htmlFor="cat-nameHi" className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Name (Hindi)</label>
                    <input
                        id="cat-nameHi"
                        type="text"
                        value={nameHi}
                        onChange={(e) => setNameHi(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        placeholder="e.g. सरकारी योजना"
                    />
                </div>
                <div>
                    <label htmlFor="cat-slugEn" className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Slug (English)</label>
                    <input
                        id="cat-slugEn"
                        type="text"
                        value={slugEn}
                        onChange={(e) => setSlugEn(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        placeholder="e.g. gov-scheme"
                    />
                </div>
                <div>
                    <label htmlFor="cat-slugHi" className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Slug (Hindi)</label>
                    <input
                        id="cat-slugHi"
                        type="text"
                        value={slugHi}
                        onChange={(e) => setSlugHi(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        placeholder="e.g. sarkari-yojana"
                    />
                </div>
                <div>
                    <label htmlFor="cat-sortOrder" className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Sort Order</label>
                    <input
                        id="cat-sortOrder"
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Create Category"}
                </button>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

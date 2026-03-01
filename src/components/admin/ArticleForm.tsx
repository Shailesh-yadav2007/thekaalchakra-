"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { slugify, slugifyHindi } from "@/lib/utils";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface Category {
    id: string;
    nameEn: string;
    nameHi: string;
    slugEn: string;
    slugHi: string;
}

interface Tag {
    id: string;
    nameEn: string;
    nameHi: string;
}

interface ArticleFormProps {
    article?: any;
    categories: Category[];
    tags: Tag[];
}

export function ArticleForm({ article, categories, tags }: ArticleFormProps) {
    const router = useRouter();
    const isEdit = !!article;
    const [activeTab, setActiveTab] = useState<"english" | "hindi">("english");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        titleEn: article?.titleEn || "",
        titleHi: article?.titleHi || "",
        slugEn: article?.slugEn || "",
        slugHi: article?.slugHi || "",
        excerptEn: article?.excerptEn || "",
        excerptHi: article?.excerptHi || "",
        bodyEn: article?.bodyEn || "",
        bodyHi: article?.bodyHi || "",
        featuredImage: article?.featuredImage || "",
        categoryId: article?.categoryId || "",
        isFeatured: article?.isFeatured || false,
        isBreaking: article?.isBreaking || false,
        metaTitleEn: article?.metaTitleEn || "",
        metaTitleHi: article?.metaTitleHi || "",
        metaDescEn: article?.metaDescEn || "",
        metaDescHi: article?.metaDescHi || "",
        status: article?.status || "DRAFT",
    });

    const uploadFile = async (file: File) => {
        if (file.size > 10 * 1024 * 1024) {
            alert("File size exceeds 10 MB limit.");
            return;
        }

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("bucket", "images");
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            handleChange("featuredImage", data.url);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) uploadFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) uploadFile(file);
        e.target.value = "";
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            // Auto-generate slug from title
            if (field === "titleEn" && !isEdit) {
                updated.slugEn = slugify(value);
            }
            if (field === "titleHi" && !isEdit) {
                updated.slugHi = slugifyHindi(value) || `hi-${Date.now()}`;
            }
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = isEdit ? `/api/articles/${article.id}` : "/api/articles";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/articles");
                router.refresh();
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="article-form">
            {/* Language Tabs */}
            <div className="form-tabs">
                <button
                    type="button"
                    className={`form-tab ${activeTab === "english" ? "active" : ""}`}
                    onClick={() => setActiveTab("english")}
                >
                    English
                </button>
                <button
                    type="button"
                    className={`form-tab ${activeTab === "hindi" ? "active" : ""}`}
                    onClick={() => setActiveTab("hindi")}
                >
                    हिंदी (Hindi)
                </button>
            </div>

            <div className="form-grid">
                {/* Main Content */}
                <div className="form-main">
                    {/* English Fields */}
                    {activeTab === "english" && (
                        <>
                            <div className="form-group">
                                <label>Title (English)</label>
                                <input
                                    type="text"
                                    value={formData.titleEn}
                                    onChange={(e) => handleChange("titleEn", e.target.value)}
                                    className="form-input"
                                    placeholder="Article title in English"
                                />
                            </div>
                            <div className="form-group">
                                <label>Slug (English)</label>
                                <input
                                    type="text"
                                    value={formData.slugEn}
                                    onChange={(e) => handleChange("slugEn", e.target.value)}
                                    className="form-input"
                                    placeholder="article-url-slug"
                                />
                            </div>
                            <div className="form-group">
                                <label>Excerpt (English)</label>
                                <textarea
                                    value={formData.excerptEn}
                                    onChange={(e) => handleChange("excerptEn", e.target.value)}
                                    className="form-textarea"
                                    rows={3}
                                    placeholder="Brief summary..."
                                    maxLength={300}
                                />
                            </div>
                            <div className="form-group">
                                <label>Body (English)</label>
                                <RichTextEditor
                                    value={formData.bodyEn}
                                    onChange={(html) => handleChange("bodyEn", html)}
                                    placeholder="Start writing the article in English..."
                                    dir="ltr"
                                />
                            </div>
                        </>
                    )}

                    {/* Hindi Fields */}
                    {activeTab === "hindi" && (
                        <>
                            <div className="form-group">
                                <label>शीर्षक (Title - Hindi)</label>
                                <input
                                    type="text"
                                    value={formData.titleHi}
                                    onChange={(e) => handleChange("titleHi", e.target.value)}
                                    className="form-input"
                                    placeholder="हिंदी में लेख का शीर्षक"
                                />
                            </div>
                            <div className="form-group">
                                <label>Slug (Hindi)</label>
                                <input
                                    type="text"
                                    value={formData.slugHi}
                                    onChange={(e) => handleChange("slugHi", e.target.value)}
                                    className="form-input"
                                    placeholder="hindi-article-slug"
                                />
                            </div>
                            <div className="form-group">
                                <label>सारांश (Excerpt - Hindi)</label>
                                <textarea
                                    value={formData.excerptHi}
                                    onChange={(e) => handleChange("excerptHi", e.target.value)}
                                    className="form-textarea"
                                    rows={3}
                                    placeholder="संक्षिप्त सारांश..."
                                    maxLength={300}
                                />
                            </div>
                            <div className="form-group">
                                <label>विषयवस्तु (Body - Hindi)</label>
                                <RichTextEditor
                                    value={formData.bodyHi}
                                    onChange={(html) => handleChange("bodyHi", html)}
                                    placeholder="हिंदी में लेख की विषयवस्तु..."
                                    dir="ltr"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar */}
                <div className="form-sidebar">
                    {/* Publish */}
                    <div className="form-card">
                        <h3 className="form-card-title">Publish</h3>
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange("status", e.target.value)}
                                className="form-select"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PENDING_REVIEW">Pending Review</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" disabled={saving} className="btn btn-primary btn-full">
                                {saving ? "Saving..." : isEdit ? "Update Article" : "Save Article"}
                            </button>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="form-card">
                        <h3 className="form-card-title">Category</h3>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => handleChange("categoryId", e.target.value)}
                            className="form-select"
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nameEn} / {cat.nameHi}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Featured Image */}
                    <div className="form-card">
                        <h3 className="form-card-title">Featured Image</h3>

                        {formData.featuredImage ? (
                            <div className="image-preview-wrapper">
                                <img
                                    src={formData.featuredImage}
                                    alt="Preview"
                                    className="form-image-preview"
                                />
                                <button
                                    type="button"
                                    className="image-remove-btn"
                                    onClick={() => handleChange("featuredImage", "")}
                                    title="Remove image"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div
                                className={`image-dropzone ${dragOver ? "dragover" : ""} ${uploading ? "uploading" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleFileDrop}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    hidden
                                />
                                {uploading ? (
                                    <>
                                        <Loader2 size={24} className="spin" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={24} />
                                        <span>Click or drag image here</span>
                                        <span className="dropzone-hint">JPG, PNG, WebP, GIF — max 10 MB</span>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="form-group" style={{ marginTop: "0.5rem" }}>
                            <label>Or paste image URL</label>
                            <input
                                type="url"
                                value={formData.featuredImage}
                                onChange={(e) => handleChange("featuredImage", e.target.value)}
                                className="form-input"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="form-card">
                        <h3 className="form-card-title">Options</h3>
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => handleChange("isFeatured", e.target.checked)}
                            />
                            Featured Article
                        </label>
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.isBreaking}
                                onChange={(e) => handleChange("isBreaking", e.target.checked)}
                            />
                            Breaking News
                        </label>
                    </div>

                    {/* SEO */}
                    <div className="form-card">
                        <h3 className="form-card-title">SEO</h3>
                        <div className="form-group">
                            <label>Meta Title ({activeTab === "english" ? "EN" : "HI"})</label>
                            <input
                                type="text"
                                value={activeTab === "english" ? formData.metaTitleEn : formData.metaTitleHi}
                                onChange={(e) =>
                                    handleChange(
                                        activeTab === "english" ? "metaTitleEn" : "metaTitleHi",
                                        e.target.value
                                    )
                                }
                                className="form-input"
                                maxLength={70}
                            />
                        </div>
                        <div className="form-group">
                            <label>Meta Description ({activeTab === "english" ? "EN" : "HI"})</label>
                            <textarea
                                value={activeTab === "english" ? formData.metaDescEn : formData.metaDescHi}
                                onChange={(e) =>
                                    handleChange(
                                        activeTab === "english" ? "metaDescEn" : "metaDescHi",
                                        e.target.value
                                    )
                                }
                                className="form-textarea"
                                rows={3}
                                maxLength={160}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

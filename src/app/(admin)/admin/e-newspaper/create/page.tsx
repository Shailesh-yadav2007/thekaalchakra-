"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, FileText } from "lucide-react";
import { createENewspaper } from "../actions";

export default function CreateENewspaperPage() {
    const router = useRouter();
    const [titleEn, setTitleEn] = useState("");
    const [titleHi, setTitleHi] = useState("");
    const [language, setLanguage] = useState<"HINDI" | "ENGLISH">("HINDI");
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                setError("Only PDF files are allowed");
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB max
                setError("File is too large (max 10MB)");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError("Please select a PDF file");
            return;
        }

        if (!titleEn || !titleHi || !publishDate) {
            setError("Please fill all required fields");
            return;
        }

        try {
            setUploading(true);
            setError(null);

            // 1. Upload to Supabase using existing API route
            const formData = new FormData();
            formData.append("file", file);
            formData.append("bucket", "e-newspapers"); // Using the requested bucket

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                const errorData = await uploadRes.json();
                throw new Error(errorData.error || "Failed to upload file");
            }

            const uploadData = await uploadRes.json();
            const pdfUrl = uploadData.url;

            // 2. Save database record using server action
            const actionRes = await createENewspaper({
                titleEn,
                titleHi,
                language,
                publishDate: new Date(publishDate),
                pdfUrl,
            });

            if (!actionRes.success) {
                throw new Error(actionRes.error);
            }

            // 3. Redirect back to list
            router.push("/admin/e-newspaper");
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Upload E-Newspaper</h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 relative">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-form-container">
                <div className="form-group">
                    <label>Title (English) *</label>
                    <input
                        type="text"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        className="form-input"
                        placeholder="e.g. Daily Edition - March 6"
                        required
                    />
                </div>

                <div className="form-group mt-4">
                    <label>Title (Hindi) *</label>
                    <input
                        type="text"
                        value={titleHi}
                        onChange={(e) => setTitleHi(e.target.value)}
                        className="form-input font-hindi"
                        placeholder="उदा. दैनिक संस्करण - 6 मार्च"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="form-group">
                        <label>Language *</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as "HINDI" | "ENGLISH")}
                            className="form-select"
                        >
                            <option value="HINDI">Hindi</option>
                            <option value="ENGLISH">English</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Publish Date *</label>
                        <input
                            type="date"
                            value={publishDate}
                            onChange={(e) => setPublishDate(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                </div>

                <div className="form-group mt-6">
                    <label>PDF File *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-2 hover:bg-gray-50 transition-colors">
                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="pdf-upload"
                        />
                        <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center justify-center">
                            {file ? (
                                <>
                                    <FileText className="w-12 h-12 text-blue-500 mb-2" />
                                    <span className="font-medium text-gray-900">{file.name}</span>
                                    <span className="text-sm text-gray-500 mt-1">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                    <span className="font-medium text-gray-900">Click to upload PDF</span>
                                    <span className="text-sm text-gray-500 mt-1">PDF max 10MB</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                <div className="form-actions mt-8 flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn btn-secondary w-full"
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary w-full justify-center"
                        disabled={uploading || !file}
                    >
                        {uploading ? "Uploading..." : "Upload E-Newspaper"}
                    </button>
                </div>
            </form>
        </div>
    );
}

"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import type { SupportedLanguage } from "@/lib/utils";

interface Comment {
    id: string;
    authorName: string;
    body: string;
    createdAt: Date;
}

interface CommentSectionProps {
    articleId: string;
    comments: Comment[];
    lang: SupportedLanguage;
}

export function CommentSection({ articleId, comments, lang }: CommentSectionProps) {
    const isHindi = lang === "hindi";
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articleId, authorName: name, authorEmail: email, body }),
            });

            if (res.ok) {
                setSubmitted(true);
                setName("");
                setEmail("");
                setBody("");
            }
        } catch {
            // handle error
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="comment-section">
            <h2 className="section-title">
                {isHindi ? `टिप्पणियाँ (${comments.length})` : `Comments (${comments.length})`}
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="comment-form">
                {submitted && (
                    <div className="comment-success">
                        {isHindi
                            ? "आपकी टिप्पणी समीक्षा के बाद प्रकाशित की जाएगी।"
                            : "Your comment will be published after moderation."}
                    </div>
                )}
                <div className="comment-form-row">
                    <input
                        type="text"
                        placeholder={isHindi ? "आपका नाम" : "Your name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="comment-input"
                    />
                    <input
                        type="email"
                        placeholder={isHindi ? "ईमेल (वैकल्पिक)" : "Email (optional)"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="comment-input"
                    />
                </div>
                <textarea
                    placeholder={isHindi ? "अपनी टिप्पणी लिखें..." : "Write your comment..."}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    rows={4}
                    className="comment-textarea"
                />
                <button type="submit" disabled={submitting} className="comment-submit-btn">
                    {submitting
                        ? (isHindi ? "भेजा जा रहा है..." : "Submitting...")
                        : (isHindi ? "टिप्पणी भेजें" : "Post Comment")}
                </button>
            </form>

            {/* Comment List */}
            <div className="comment-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                            <strong className="comment-author">{comment.authorName}</strong>
                            <time className="comment-date">
                                {formatDate(comment.createdAt, lang)}
                            </time>
                        </div>
                        <p className="comment-body">{comment.body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

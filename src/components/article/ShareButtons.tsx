"use client";

import { Share2 } from "lucide-react";

interface ShareButtonsProps {
    url: string;
    title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: "WhatsApp",
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            color: "#25D366",
            icon: "💬",
        },
        {
            name: "X",
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: "#000000",
            icon: "𝕏",
        },
        {
            name: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "#1877F2",
            icon: "f",
        },
    ];

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            alert("Link copied!");
        } catch {
            // fallback
        }
    };

    return (
        <div className="share-buttons">
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn"
                    title={`Share on ${link.name}`}
                    style={{ "--share-color": link.color } as React.CSSProperties}
                >
                    <span className="share-icon">{link.icon}</span>
                </a>
            ))}
            <button
                onClick={handleCopyLink}
                className="share-btn share-copy"
                title="Copy link"
            >
                <Share2 size={16} />
            </button>
        </div>
    );
}

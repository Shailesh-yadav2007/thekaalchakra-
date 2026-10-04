"use client";

import { useState } from "react";
import Image from "next/image";
import { Youtube, Play, X, ExternalLink, Eye, Clock } from "lucide-react";
import { formatRelativeTime, extractYouTubeId, type SupportedLanguage } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export interface VideoItem {
    id: string;
    titleEn: string;
    titleHi: string;
    youtubeUrl: string;
    thumbnailUrl?: string;
    duration?: string;
    views?: string;
    publishedAt: Date | string;
    tag?: "special" | "ground" | "discussion" | "shorts" | "all";
}

interface VideoGridProps {
    videos: VideoItem[];
    lang: SupportedLanguage;
}

export function VideoGrid({ videos, lang }: VideoGridProps) {
    const isHindi = lang === "hindi";
    const [selectedTab, setSelectedTab] = useState<string>("all");
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

    const tabs = [
        { id: "all", label: isHindi ? "सभी" : "All" },
        { id: "special", label: isHindi ? "विशेष रिपोर्ट" : "Special Reports" },
        { id: "ground", label: isHindi ? "ग्राउंड रिपोर्ट" : "Ground Reports" },
        { id: "discussion", label: isHindi ? "चर्चा" : "Discussions" },
        { id: "shorts", label: isHindi ? "शॉर्ट्स" : "Shorts" },
    ];

    const filteredVideos = videos.filter((v) => {
        if (selectedTab === "all") return true;
        if (selectedTab === "shorts") return v.tag === "shorts" || v.youtubeUrl.includes("/shorts/");
        return v.tag === selectedTab;
    });

    return (
        <div className="space-y-6">
            {/* YouTube Channel Banner Card (Matching Design Mockup) */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 rounded-2xl p-5 md:p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                        <Youtube size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                            {isHindi ? "हमारे YouTube चैनल की ताज़ा वीडियोज" : "Latest Videos from Our YouTube Channel"}
                        </h2>
                        <p className="text-xs md:text-sm text-red-100 mt-0.5">
                            {isHindi ? "सच्ची खबरें, ज़मीनी रिपोर्ट और निष्पक्ष चर्चाएँ" : "True news, ground reports & unbiased discussions"}
                        </p>
                    </div>
                </div>

                <a
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-red-700 hover:bg-red-50 font-bold text-sm px-5 py-2.5 rounded-full shadow-sm transition-transform active:scale-95 shrink-0"
                >
                    <Youtube size={18} />
                    <span>{isHindi ? "चैनल देखें" : "Visit Channel"}</span>
                    <ExternalLink size={14} />
                </a>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${
                            selectedTab === tab.id
                                ? "bg-[var(--color-primary)] text-white shadow-sm"
                                : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Video Cards Grid */}
            {filteredVideos.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                    <Youtube size={48} className="mx-auto text-[var(--color-text-muted)] mb-3 opacity-60" />
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                        {isHindi ? "कोई वीडियो उपलब्ध नहीं है।" : "No videos found for this filter."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => {
                        const videoId = extractYouTubeId(video.youtubeUrl);
                        const thumbUrl = video.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "/logo.png");
                        const title = isHindi ? video.titleHi : video.titleEn;

                        return (
                            <div
                                key={video.id}
                                onClick={() => setActiveVideo(video)}
                                className="group bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                            >
                                {/* Video Thumbnail & Duration Pill */}
                                <div className="relative aspect-video bg-black overflow-hidden">
                                    <img
                                        src={thumbUrl}
                                        alt={title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                                        loading="lazy"
                                    />
                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <Play size={22} className="fill-current ml-0.5" />
                                        </div>
                                    </div>

                                    {/* Duration Pill */}
                                    {video.duration && (
                                        <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[11px] font-semibold px-2 py-0.5 rounded">
                                            {video.duration}
                                        </span>
                                    )}
                                </div>

                                {/* Content Details */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <h3 className="font-bold text-sm md:text-base text-[var(--color-text)] line-clamp-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                                        {title}
                                    </h3>

                                    <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mt-3 pt-3 border-t border-[var(--color-border-light)]">
                                        <span className="font-medium text-[var(--color-text-secondary)]">The Kaalchakra News</span>
                                        <div className="flex items-center gap-2">
                                            {video.views && (
                                                <span className="flex items-center gap-1">
                                                    <Eye size={12} /> {video.views}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} /> {formatRelativeTime(video.publishedAt, lang)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Embedded Player Overlay */}
            {activeVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setActiveVideo(null)}
                >
                    <div
                        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-3 bg-zinc-900 text-white">
                            <h4 className="font-bold text-sm md:text-base line-clamp-1">
                                {isHindi ? activeVideo.titleHi : activeVideo.titleEn}
                            </h4>
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="p-1 text-gray-400 hover:text-white rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Player 16:9 Iframe */}
                        <div className="relative aspect-video w-full bg-black">
                            {extractYouTubeId(activeVideo.youtubeUrl) ? (
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(activeVideo.youtubeUrl)}?autoplay=1&rel=0`}
                                    title={isHindi ? activeVideo.titleHi : activeVideo.titleEn}
                                    className="absolute inset-0 w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                                    {isHindi ? "वीडियो लोड नहीं हो सका।" : "Unable to load video."}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function AgreementModal({
    onAgree,
    onClose,
}: {
    onAgree: () => void;
    onClose: () => void;
}) {
    const [agreed, setAgreed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-red-700 px-5 py-4 flex items-center justify-between">
                    <h2 className="text-white font-bold text-base tracking-wide">
                        Reporter Responsibility Agreement
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white text-2xl leading-none cursor-pointer"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-5 max-h-[280px] overflow-y-auto space-y-3 [scrollbar-width:thin]">
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400 pl-3 border-l-2 border-red-700">
                        इस प्लेटफ़ॉर्म पर प्रकाशित किसी भी समाचार, लेख, फोटो, वीडियो या अन्य सामग्री के लिए संबंधित रिपोर्टर / योगदानकर्ता स्वयं जिम्मेदार होगा।
                    </p>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400 pl-3 border-l-2 border-red-700">
                        रिपोर्टर यह सुनिश्चित करेगा कि प्रस्तुत की गई जानकारी सत्य, प्रमाणित और किसी व्यक्ति, संस्था, समुदाय या संगठन की मानहानि करने वाली न हो।
                    </p>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400 pl-3 border-l-2 border-red-700">
                        यदि किसी सामग्री के कारण किसी प्रकार का कानूनी विवाद, शिकायत या मानहानि का मामला उत्पन्न होता है, तो उसकी प्राथमिक जिम्मेदारी संबंधित लेखक / रिपोर्टर की होगी।
                    </p>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400 pl-3 border-l-2 border-red-700">
                        प्लेटफ़ॉर्म प्रशासन को यह अधिकार होगा कि वह किसी भी सामग्री की समीक्षा करे तथा आवश्यक होने पर उसे संपादित, अस्वीकार या हटाने का निर्णय ले सके।
                    </p>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400 pl-3 border-l-2 border-red-700">
                        रिपोर्टर इस बात से सहमत है कि वह प्लेटफ़ॉर्म की नीतियों, लागू कानूनों तथा पत्रकारिता के नैतिक मानकों का पालन करेगा।
                    </p>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5 pt-4 border-t border-gray-200 dark:border-zinc-700 flex flex-col gap-4">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-[18px] h-[18px] accent-red-700 cursor-pointer shrink-0"
                        />
                        <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                            I Agree to the Terms &amp; Conditions
                        </span>
                    </label>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 font-semibold text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!agreed}
                            onClick={onAgree}
                            className="flex-[1.5] py-2.5 px-4 rounded-lg bg-red-700 text-white font-semibold text-sm cursor-pointer hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Agree &amp; Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAgreement, setShowAgreement] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setShowAgreement(true);
    };

    const handleAgreeAndLogin = async () => {
        setShowAgreement(false);
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setLoading(false);
            } else {
                router.replace("/admin");
            }
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h1 className="admin-login-title">TheKaalchakra</h1>
                    <p className="admin-login-subtitle">Admin Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && <div className="admin-login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@thekaalchakra.news"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="form-input"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="admin-login-btn">
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>

            {showAgreement && (
                <AgreementModal
                    onAgree={handleAgreeAndLogin}
                    onClose={() => setShowAgreement(false)}
                />
            )}
        </div>
    );
}

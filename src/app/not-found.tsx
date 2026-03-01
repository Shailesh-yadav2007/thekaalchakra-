"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <Link href="/" className="mb-8">
                <Image
                    src="/logo.png"
                    alt="TheKaalchakra Logo"
                    width={150}
                    height={150}
                    className="mx-auto drop-shadow-sm"
                />
                <h1 className="text-2xl font-serif font-bold text-[#b42828] mt-2 -ml-8 tracking-tight">TheKaalchakra</h1>
            </Link>

            <h2 className="text-6xl font-black text-gray-900 mb-4 tracking-tighter shadow-sm">404</h2>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h3>
            <p className="text-gray-500 max-w-md mb-8">
                Oops! We couldn't find the page you were looking for.
                It might have been removed, renamed, or temporarily unavailable.
            </p>

            <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#b42828] hover:bg-[#8f2020] transition-colors shadow-sm"
            >
                Return to Homepage
            </Link>
        </div>
    );
}

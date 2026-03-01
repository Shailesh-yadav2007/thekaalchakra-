"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error Caught:", error);
    }, [error]);

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

            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Something went wrong!</h2>
            <p className="text-gray-500 max-w-md mb-8">
                An unexpected error has occurred while trying to load this page.
                Our team has been notified.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#b42828] hover:bg-[#8f2020] transition-colors shadow-sm"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}

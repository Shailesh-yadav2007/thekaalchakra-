import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const SUPPORTED_LANGUAGES = ["hindi", "english"];
const DEFAULT_LANGUAGE = "english";

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ─── Redirect root to default language ──────────────────────────
    if (pathname === "/") {
        return NextResponse.redirect(new URL(`/${DEFAULT_LANGUAGE}`, request.url));
    }

    // ─── Protect admin routes ───────────────────────────────────────
    if (pathname.startsWith("/admin")) {
        // Allow access to login page
        if (pathname === "/admin/login") {
            return NextResponse.next();
        }

        const session = await auth();
        if (!session?.user) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        // Role-based protection for user management (Owner/Admin only)
        if (pathname.startsWith("/admin/users")) {
            const role = (session.user as any).role;
            if (role !== "OWNER" && role !== "ADMIN") {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
        }
    }

    // ─── Validate language param for public routes ──────────────────
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && !pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
        const lang = segments[0];
        if (!SUPPORTED_LANGUAGES.includes(lang)) {
            // If first segment isn't a valid language, redirect to default
            return NextResponse.redirect(
                new URL(`/${DEFAULT_LANGUAGE}${pathname}`, request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public files (svg, png, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};

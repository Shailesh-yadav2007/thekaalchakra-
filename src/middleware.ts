import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

        // On Vercel custom domains (HTTPS), NextAuth prefixes the cookie with __Secure-
        // We explicitly tell it to check both to ensure domain compatibility.
        const useSecureCookies = request.url.startsWith("https://");
        const cookieName = useSecureCookies
            ? "__Secure-authjs.session-token"
            : "authjs.session-token"; // fallback for next-auth v5 beta naming

        const token = await getToken({
            req: request,
            secret: process.env.AUTH_SECRET,
            cookieName: cookieName,
        });

        // Try the legacy next-auth.session-token if authjs.session-token fails
        const legacyToken = !token
            ? await getToken({
                req: request,
                secret: process.env.AUTH_SECRET,
                cookieName: useSecureCookies
                    ? "__Secure-next-auth.session-token"
                    : "next-auth.session-token",
            })
            : null;

        const finalToken = token || legacyToken;

        if (!finalToken) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        // Role-based protection for user management (Owner/Admin only)
        if (pathname.startsWith("/admin/users")) {
            const role = finalToken.role as string;
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


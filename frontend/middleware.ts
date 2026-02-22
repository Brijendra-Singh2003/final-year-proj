import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
    patient: ["/patient"],
    doctor: ["/doctor"],
    admin: ["/admin"],
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const { pathname } = request.nextUrl;

    const protectedPrefixes = ["/patient", "/doctor", "/admin"];
    const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token) {
        try {
            // Decode JWT payload (no signature verification possible in edge)
            const payload = JSON.parse(
                Buffer.from(token.split(".")[1], "base64").toString()
            );
            const role: string = payload.role;

            for (const [r, paths] of Object.entries(ROLE_ROUTES)) {
                if (r !== role && paths.some((p) => pathname.startsWith(p))) {
                    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
                }
            }
        } catch {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/patient/:path*", "/doctor/:path*", "/admin/:path*"],
};

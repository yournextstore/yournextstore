import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_ENABLED } from "./lib/auth-config";
import { getSubdomainPublicUrl } from "./lib/commerce";

// /account is auth-only: when auth is off it is neither protected nor proxied.
const protectedRoutes = AUTH_ENABLED ? ["/account"] : [];
const proxiedRoutes = AUTH_ENABLED
	? ["/checkout", "/api/feed/", "/api/chat", "/account"]
	: ["/checkout", "/api/feed/", "/api/chat"];

export async function proxy(request: NextRequest) {
	// Auth: redirect unauthenticated users away from protected routes
	const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
	if (isProtected) {
		const sessionCookie = request.cookies.get("better-auth.session_token");
		if (!sessionCookie) {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// Platform-owned scripts under /_public/ — forwarded verbatim (plus the store, so the
	// platform can generate per-store responses) and served by the platform. Which paths are
	// static and which are dynamic is the platform's decision; this branch holds no knowledge
	// of individual assets. Do not modify.
	if (request.nextUrl.pathname.startsWith("/_public/")) {
		const { subdomain, publicUrl } = await getSubdomainPublicUrl();
		const destination = new URL(request.nextUrl.pathname, publicUrl);
		destination.searchParams.set("store", subdomain);
		return NextResponse.rewrite(destination);
	}

	// Checkout & feed proxy: rewrite to the backend
	if (proxiedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
		const { subdomain, publicUrl } = await getSubdomainPublicUrl();
		const destinationUrl = new URL(publicUrl);

		const requestHeaders = new Headers(request.headers);
		// Only reaches a local / self-hosted backend: on Vercel the platform's edge
		// replaces this with the real Host before the app ever sees it.
		requestHeaders.set("x-forwarded-host", destinationUrl.host);
		// The browser's `Origin` is forwarded verbatim, and a request that carried none
		// still arrives with none. Overwriting it with the platform origin — as this proxy
		// used to — laundered every cross-site POST into a trusted one, disabling CSRF
		// protection for both Next's Server Action check and better-auth. The platform
		// validates the forwarded origin against this store's own domains instead.
		// This header marks the proxy as one that forwards; the platform only uses it to
		// *tighten* the check, so it grants nothing if forged.
		requestHeaders.set("x-yns-forwarded-origin", "1");

		const url = new URL(`/${subdomain}${request.nextUrl.pathname}${request.nextUrl.search}`, destinationUrl);
		url.searchParams.set("auth", "0");

		return NextResponse.rewrite(url, {
			request: {
				headers: requestHeaders,
			},
		});
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/checkout/:path*",
		"/api/feed/gmc",
		"/api/feed/meta",
		"/api/feed/openai",
		"/api/chat",
		"/api/chat/:path*",
		"/account",
		"/account/:path*",
		"/_public/:path*",
	],
};

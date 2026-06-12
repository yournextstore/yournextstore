import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSubdomainPublicUrl } from "./lib/commerce";

const protectedRoutes = ["/account"];
const proxiedRoutes = ["/checkout", "/api/feed/"];

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

	// Checkout & feed proxy: rewrite to the backend
	if (proxiedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
		const { subdomain, publicUrl } = await getSubdomainPublicUrl();
		const destinationUrl = new URL(publicUrl);

		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-forwarded-host", destinationUrl.host);
		requestHeaders.set("origin", destinationUrl.toString());

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
	matcher: ["/checkout/:path*", "/api/feed/gmc", "/api/feed/meta", "/api/feed/openai", "/account/:path*"],
};

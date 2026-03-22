import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getSubdomainPublicUrl } from "./lib/commerce";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Checkout routes: rewrite to subdomain
	if (pathname.startsWith("/checkout")) {
		const { subdomain, publicUrl } = await getSubdomainPublicUrl();
		const destinationUrl = new URL(publicUrl);

		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-forwarded-host", destinationUrl.host);
		requestHeaders.set("origin", destinationUrl.toString());

		const url = new URL(`/${subdomain}${request.nextUrl.pathname}${request.nextUrl.search}`, destinationUrl);

		return NextResponse.rewrite(url, {
			request: { headers: requestHeaders },
		});
	}

	// All other routes: locale detection + redirect
	return intlMiddleware(request);
}

export const config = {
	matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/checkout/:path*"],
};

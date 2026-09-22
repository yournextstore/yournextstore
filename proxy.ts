import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSubdomainPublicUrl } from "./lib/commerce";

// /account is the platform-rendered shopper account area (unified sign-in); the platform
// handles unauthenticated access itself, so it is proxied like /checkout, never guarded here.
//
// The webhook paths are here for addresses merchants already registered on this domain; the
// platform resolves the store from the `/<subdomain>` prefix like it does for checkout.
const proxiedRoutes = [
	"/checkout",
	"/api/feed/",
	"/api/chat",
	"/api/frame-webhook",
	"/api/montonio-webhook",
	"/account",
];

// Links the platform used to email on this domain. They now live on the platform domain, where
// the token or id alone identifies the target, so old emails are redirected there.
const movedLinks: Record<string, string> = {
	"/unsubscribe": "/n/unsubscribe",
	"/confirm-subscription": "/n/confirm",
};

// Endpoints another server calls on this domain, served by the platform at a store-less path:
// rewritten rather than redirected, since a mailbox provider's one-click unsubscribe, a carrier's
// webhook and a search engine fetching the IndexNow key do not reliably follow redirects.
const platformEndpoints: Record<string, string> = {
	"/unsubscribe/post": "/n/unsubscribe/post",
	"/api/inpost-webhook": "/api/inpost-webhook",
	"/api/indexnow": "/api/indexnow",
};
const DIGITAL_ASSETS_PREFIX = "/digital-assets/";
// PayNow only accepts a notification address under the shop's registered domain, so the platform
// registers `/api/paynow/<storeId>/webhooks` here and this forwards it to the same platform path.
const PAYNOW_WEBHOOK_PREFIX = "/api/paynow/";

export async function proxy(request: NextRequest) {
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

	// GetResponse's dashboard checks for its web-push worker at the site root. The storefront kit
	// registers the platform copy under /_public/scripts/, so the root path serves that same file.
	if (request.nextUrl.pathname === "/gr_sw_main.js") {
		const { publicUrl } = await getSubdomainPublicUrl();
		return NextResponse.rewrite(new URL("/_public/scripts/gr_sw_main.js", publicUrl));
	}

	const { pathname, search } = request.nextUrl;
	const movedLink = movedLinks[pathname];
	if (movedLink) {
		const { publicUrl } = await getSubdomainPublicUrl();
		return NextResponse.redirect(new URL(`${movedLink}${search}`, publicUrl), 308);
	}
	const platformEndpoint = platformEndpoints[pathname];
	if (platformEndpoint) {
		const { publicUrl } = await getSubdomainPublicUrl();
		return NextResponse.rewrite(new URL(`${platformEndpoint}${search}`, publicUrl));
	}
	if (pathname.startsWith(PAYNOW_WEBHOOK_PREFIX)) {
		const { publicUrl } = await getSubdomainPublicUrl();
		return NextResponse.rewrite(new URL(`${pathname}${search}`, publicUrl));
	}
	if (pathname.startsWith(DIGITAL_ASSETS_PREFIX)) {
		const { publicUrl } = await getSubdomainPublicUrl();
		const downloadId = pathname.slice(DIGITAL_ASSETS_PREFIX.length);
		return NextResponse.redirect(new URL(`/api/digital-assets/${downloadId}`, publicUrl), 308);
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
		"/checkout",
		"/checkout/:path*",
		"/api/feed/:path*",
		"/api/chat",
		"/api/chat/:path*",
		"/api/indexnow",
		"/api/frame-webhook",
		"/api/montonio-webhook",
		"/api/inpost-webhook",
		"/api/paynow/:path*",
		"/unsubscribe",
		"/unsubscribe/post",
		"/confirm-subscription",
		"/digital-assets/:path*",
		"/account",
		"/account/:path*",
		"/_public/:path*",
		"/gr_sw_main.js",
	],
};

import { Commerce } from "commerce-kit";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { markdownRewritePath } from "./lib/markdown";

// Where the platform serves this store: every branch below forwards there, the checkout included.
//
// Keep this lookup inside this file, and keep `next/cache` and lib/commerce.ts out of it. The proxy
// runs outside Next's cache: `"use cache"` has no effect here, and `cacheTag()` or `cacheLife()`
// throws, which answers 500 on every forwarded address (proxy-address.test.ts). This is also one of
// the platform-managed files, copied into stores by itself, so it cannot lean on newer store code.
type PlatformAddress = { subdomain: string; publicUrl: string };

/** From the environment: a fixed value, with no network call. */
const addressFromEnvironment = (): PlatformAddress | null => {
	const tenant = process.env.NEXT_PUBLIC_YNS_API_TENANT;
	if (!tenant) return null;
	const tenantUrl = new URL(tenant);
	const [subdomain, ...base] = tenantUrl.host.split(".");
	const apiHost = base.join(".");
	if (!subdomain || !apiHost) return null;
	// Preserve the tenant's scheme/port so local http backends work (not just https).
	return { subdomain, publicUrl: `${tenantUrl.protocol}//${apiHost}` };
};

const addressFromApi = async (): Promise<PlatformAddress> => {
	const {
		store: { subdomain },
		publicUrl,
	} = await Commerce({
		token: process.env.YNS_API_KEY,
		endpoint: process.env.YNS_API_URL || undefined,
	}).meGet();
	return { subdomain, publicUrl };
};

// The API answer never changes within a deployment, so one call per server instance is enough.
// A failed call is not kept: the next request tries again.
let apiAddress: Promise<PlatformAddress> | null = null;

const getSubdomainPublicUrl = async (): Promise<PlatformAddress> => {
	const fixed = addressFromEnvironment();
	if (fixed) return fixed;
	apiAddress ??= addressFromApi().catch((error) => {
		apiAddress = null;
		throw error;
	});
	return apiAddress;
};

// /account is the platform-rendered shopper account area (unified sign-in); the platform
// handles unauthenticated access itself, so it is proxied like /checkout, never guarded here.
//
// The webhook paths are here for addresses merchants already registered on this domain; the
// platform resolves the store from the `/<subdomain>` prefix like it does for checkout.
//
// /api/mcp is the store's MCP server, the address an AI assistant (ChatGPT, Claude) is connected to.
const proxiedRoutes = [
	"/checkout",
	"/api/feed/",
	"/api/chat",
	"/api/mcp",
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
const EDGE_COUNTRY_HEADER = "x-vercel-ip-country";
const SHOPPER_COUNTRY_HEADER = "x-yns-shopper-country";

export async function proxy(request: NextRequest) {
	// Platform-owned scripts under /_public/ — forwarded verbatim (plus the store, so the
	// platform can generate per-store responses) and served by the platform. Which paths are
	// static and which are dynamic is the platform's decision; this branch holds no knowledge
	// of individual assets. Do not modify.
	if (request.nextUrl.pathname.startsWith("/_public/")) {
		const { subdomain, publicUrl } = await getSubdomainPublicUrl();
		const destination = new URL(request.nextUrl.pathname, publicUrl);
		destination.searchParams.set("store", subdomain);
		// The cookie banner can be limited to some countries; only this edge sees the shopper's.
		const country = request.headers.get(EDGE_COUNTRY_HEADER);
		if (country) destination.searchParams.set("country", country);
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
		// The shopper's country, for checkout's cookie banner and delivery country. Only this
		// edge sees it: the platform's own geo headers name this edge, not the shopper.
		const country = request.headers.get(EDGE_COUNTRY_HEADER);
		requestHeaders.delete(SHOPPER_COUNTRY_HEADER);
		if (country) requestHeaders.set(SHOPPER_COUNTRY_HEADER, country);

		const url = new URL(`/${subdomain}${request.nextUrl.pathname}${request.nextUrl.search}`, destinationUrl);
		url.searchParams.set("auth", "0");

		return NextResponse.rewrite(url, {
			request: {
				headers: requestHeaders,
			},
		});
	}

	// An AI agent asking a page for Markdown gets the platform's Markdown version of it, at the
	// page's own address, in the page's language. See lib/markdown.ts.
	const markdownRoute = markdownRewritePath(request);
	if (markdownRoute) {
		const { subdomain, publicUrl } = await getSubdomainPublicUrl();
		return NextResponse.rewrite(new URL(`/${subdomain}${markdownRoute}`, publicUrl));
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
		"/api/mcp",
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
		// Pages with a Markdown version (lib/markdown.ts), optionally under a language prefix (`/de`).
		// A `.md` address always asks for Markdown.
		"/index.md",
		"/:lang([a-z]{2})/index.md",
		"/:lang([a-z]{2})?/search.md",
		"/:lang([a-z]{2})?/:kind(product|collection|blog)/:file(.+\\.md)",
		// The page's own address only when the Accept header mentions Markdown, so a browser's page
		// view never runs this proxy and stays a cache hit. `prefersMarkdown` makes the final call.
		{ source: "/", has: [{ type: "header", key: "accept", value: ".*text/(?:markdown|plain).*" }] },
		{
			source: "/:lang([a-z]{2})",
			has: [{ type: "header", key: "accept", value: ".*text/(?:markdown|plain).*" }],
		},
		{
			source: "/:lang([a-z]{2})?/search",
			has: [{ type: "header", key: "accept", value: ".*text/(?:markdown|plain).*" }],
		},
		{
			source: "/:lang([a-z]{2})?/:kind(product|collection|blog)/:slug",
			has: [{ type: "header", key: "accept", value: ".*text/(?:markdown|plain).*" }],
		},
	],
};

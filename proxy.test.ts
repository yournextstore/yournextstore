import { expect, test } from "bun:test";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";

// `getSubdomainPublicUrl` reads this at call time, so setting it here is enough to keep
// the proxy off the network — no module mock, which would leak to every other test file
// importing `lib/commerce`.
process.env.NEXT_PUBLIC_YNS_API_TENANT = "https://acme.yns.cx";
// `lib/commerce` asserts this at import time, and bun skips `.env.local` under NODE_ENV=test.
process.env.YNS_API_KEY ||= "test-key";

const { config, proxy } = await import("./proxy");

const checkoutRequest = (headers: Record<string, string>) =>
	proxy(new NextRequest("https://acme.example/checkout/payment", { method: "POST", headers }));

/** `NextResponse.rewrite` carries the mutated request headers in this internal header. */
const forwardedHeaders = (response: Response) => {
	const middlewareHeaders = response.headers.get("x-middleware-override-headers");
	return new Set(middlewareHeaders?.split(",").map((name) => name.trim()) ?? []);
};

const forwardedValue = (response: Response, name: string) =>
	response.headers.get(`x-middleware-request-${name}`);

test("forwards the browser's Origin untouched", async () => {
	const response = await checkoutRequest({ origin: "https://acme.example" });

	expect(forwardedValue(response, "origin")).toBe("https://acme.example");
	expect(forwardedValue(response, "x-yns-forwarded-origin")).toBe("1");
});

test("a request without an Origin gets none", async () => {
	const response = await checkoutRequest({});

	expect(forwardedHeaders(response).has("origin")).toBe(false);
	expect(forwardedValue(response, "origin")).toBeNull();
});

test("still rewrites to the subdomain path with auth=0", async () => {
	const response = await checkoutRequest({ origin: "https://acme.example" });

	expect(response.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/checkout/payment?auth=0");
});

const get = (path: string) => proxy(new NextRequest(`https://acme.example${path}`));

test("sends old unsubscribe and confirmation links to the platform pages", async () => {
	const unsubscribe = await get("/unsubscribe?token=abc");
	expect(unsubscribe.status).toBe(308);
	expect(unsubscribe.headers.get("location")).toBe("https://yns.cx/n/unsubscribe?token=abc");

	const confirm = await get("/confirm-subscription?token=abc");
	expect(confirm.headers.get("location")).toBe("https://yns.cx/n/confirm?token=abc");
});

test("serves the one-click unsubscribe in place — mailbox providers do not follow redirects", async () => {
	const response = await proxy(
		new NextRequest("https://acme.example/unsubscribe/post?token=abc", { method: "POST" }),
	);

	expect(response.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/n/unsubscribe/post?token=abc");
});

test("redirects an old download link without touching the case-sensitive id", async () => {
	const response = await get("/digital-assets/AbC-dEf_123");

	expect(response.headers.get("location")).toBe("https://yns.cx/api/digital-assets/AbC-dEf_123");
});

test("forwards webhooks registered on this domain to the platform", async () => {
	const frame = await proxy(new NextRequest("https://acme.example/api/frame-webhook", { method: "POST" }));
	expect(frame.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/api/frame-webhook?auth=0");

	const inpost = await proxy(new NextRequest("https://acme.example/api/inpost-webhook", { method: "POST" }));
	expect(inpost.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/api/inpost-webhook");

	// PayNow insists on the shop's own domain, so this address is registered here and
	// forwarded store-less: the store id is in the path.
	const paynow = await proxy(
		new NextRequest("https://acme.example/api/paynow/0199-store/webhooks", { method: "POST" }),
	);
	expect(paynow.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/api/paynow/0199-store/webhooks");
});

test("serves the IndexNow key from the platform, which holds it", async () => {
	const response = await get("/api/indexnow");

	expect(response.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/api/indexnow");
});

const withAccept = (path: string, accept: string) =>
	proxy(new NextRequest(`https://acme.example${path}`, { headers: { accept } }));

test("sends an agent asking a page for Markdown to the platform's Markdown version", async () => {
	const product = await withAccept("/product/blue-mug", "text/markdown");
	expect(product.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/md/product/blue-mug");

	const home = await withAccept("/", "text/plain");
	expect(home.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/md");

	const search = await withAccept("/search?q=mug", "text/markdown, text/html;q=0.9");
	expect(search.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/md/search?q=mug");
});

test("answers `.md` addresses in Markdown whatever the Accept header says", async () => {
	const product = await withAccept("/product/blue-mug.md", "text/html");
	expect(product.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/md/product/blue-mug");

	const collection = await get("/collection/summer.md");
	expect(collection.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/md/collection/summer");

	const home = await get("/index.md");
	expect(home.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/md");
});

test("keeps serving HTML to browsers", async () => {
	const browser = await withAccept(
		"/product/blue-mug",
		"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
	);
	expect(browser.headers.get("x-middleware-rewrite")).toBeNull();

	const anything = await withAccept("/collection/summer", "*/*");
	expect(anything.headers.get("x-middleware-rewrite")).toBeNull();
});

test("leaves pages without a Markdown version alone", async () => {
	const cart = await withAccept("/cart", "text/markdown");
	expect(cart.headers.get("x-middleware-rewrite")).toBeNull();
});

test("answers blog posts and pages in other languages in Markdown", async () => {
	const post = await withAccept("/blog/brewing", "text/markdown");
	expect(post.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/md/blog/brewing");

	const german = await withAccept("/de/product/blaue-tasse?variant=v1", "text/plain");
	expect(german.headers.get("x-middleware-rewrite")).toBe(
		"https://yns.cx/acme/md/product/blaue-tasse?variant=v1&lang=de",
	);

	const frenchPost = await get("/fr/blog/infusion.md");
	expect(frenchPost.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/md/blog/infusion?lang=fr");

	const germanHome = await get("/de/index.md");
	expect(germanHome.headers.get("x-middleware-rewrite")).toBe("https://yns.cx/acme/md?lang=de");
});

const BROWSER = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8";

test("runs only for agents on page addresses, so browsers' page views skip the proxy", () => {
	const runs = (url: string, accept: string) =>
		unstable_doesMiddlewareMatch({ config, url, headers: { accept } });

	expect(runs("/product/blue-mug", BROWSER)).toBe(false);
	expect(runs("/", BROWSER)).toBe(false);
	expect(runs("/de/blog/x", "*/*")).toBe(false);

	expect(runs("/product/blue-mug", "text/markdown")).toBe(true);
	expect(runs("/", "text/plain")).toBe(true);
	expect(runs("/de", "text/markdown")).toBe(true);
	expect(runs("/de/blog/x", "text/markdown, text/html")).toBe(true);
	expect(runs("/fr/search", "text/markdown")).toBe(true);

	expect(runs("/product/blue-mug.md", BROWSER)).toBe(true);
	expect(runs("/de/collection/sommer.md", BROWSER)).toBe(true);
	expect(runs("/index.md", BROWSER)).toBe(true);
	expect(runs("/it/index.md", BROWSER)).toBe(true);
	expect(runs("/search.md", BROWSER)).toBe(true);

	expect(runs("/about-us", "text/markdown")).toBe(false);
	expect(runs("/logo.svg", "text/plain")).toBe(false);
	expect(runs("/checkout", BROWSER)).toBe(true);
});

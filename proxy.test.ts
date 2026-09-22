import { expect, test } from "bun:test";
import { NextRequest } from "next/server";

// `getSubdomainPublicUrl` reads this at call time, so setting it here is enough to keep
// the proxy off the network — no module mock, which would leak to every other test file
// importing `lib/commerce`.
process.env.NEXT_PUBLIC_YNS_API_TENANT = "https://acme.yns.cx";
// `lib/commerce` asserts this at import time, and bun skips `.env.local` under NODE_ENV=test.
process.env.YNS_API_KEY ||= "test-key";

const { proxy } = await import("./proxy");

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

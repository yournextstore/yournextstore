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

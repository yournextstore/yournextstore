import { afterAll, beforeEach, expect, test } from "bun:test";
import { NextRequest } from "next/server";

// A store built by the platform has no NEXT_PUBLIC_YNS_API_TENANT, so its proxy asks the API where
// the platform is. This file runs the proxy that way. The proxy runs outside Next's cache: a cache
// call anywhere on this path (`cacheTag`, `cacheLife`) throws there, and the checkout answers 500.
process.env.YNS_API_KEY ||= "test-key";

const realFetch = globalThis.fetch;
const apiCalls: string[] = [];
const stubFetch = async (input: string | URL | Request) => {
	const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
	apiCalls.push(url);
	return Response.json({ store: { subdomain: "acme" }, publicUrl: "https://yns.cx" });
};
globalThis.fetch = Object.assign(stubFetch, { preconnect: realFetch.preconnect });
afterAll(() => {
	globalThis.fetch = realFetch;
});

const { proxy } = await import("./proxy");

beforeEach(() => {
	delete process.env.NEXT_PUBLIC_YNS_API_TENANT;
});

const FORWARDED = [
	["/checkout", "https://yns.cx/acme/checkout?auth=0"],
	["/checkout/payment", "https://yns.cx/acme/checkout/payment?auth=0"],
	["/account", "https://yns.cx/acme/account?auth=0"],
	["/api/chat", "https://yns.cx/acme/api/chat?auth=0"],
	["/_public/kit.js", "https://yns.cx/_public/kit.js?store=acme"],
] as const;

test.each(FORWARDED)("forwards %s when the address comes from the API", async (path, destination) => {
	const response = await proxy(new NextRequest(`https://acme.example${path}`));
	expect(response.headers.get("x-middleware-rewrite")).toBe(destination);
});

test("asks the API for the address once, not on every request", async () => {
	await proxy(new NextRequest("https://acme.example/checkout"));
	await proxy(new NextRequest("https://acme.example/account"));
	expect(apiCalls.filter((url) => url.endsWith("/me"))).toHaveLength(1);
});

test("the proxy's own files never reach for Next's cache", async () => {
	// lib/commerce.ts labels its cached reads; importing it here would put those calls on this path.
	const sources = await Promise.all(["proxy.ts", "lib/markdown.ts"].map((file) => Bun.file(file).text()));
	const imported = sources.flatMap((source) =>
		[...source.matchAll(/from "([^"]+)"/g)].map((match) => match[1]),
	);
	expect(imported.length).toBeGreaterThan(0);
	for (const banned of ["next/cache", "lib/commerce", "lib/cache-tags"]) {
		expect(imported.filter((specifier) => specifier?.includes(banned))).toEqual([]);
	}
});

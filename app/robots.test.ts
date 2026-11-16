import { expect, mock, test } from "bun:test";

// lib/commerce asserts YNS_API_KEY at import time — stub it before the dynamic import.
process.env.YNS_API_KEY ??= "test-key";

// The store read robots.txt makes for the merchant's own rules: what the Store API returned, or a failure.
const commerceModule = await import("@/lib/commerce");
const store: { settings: Record<string, unknown>; failing: boolean } = { settings: {}, failing: false };
mock.module("@/lib/commerce", () => ({
	...commerceModule,
	meGetCached: async () => {
		if (store.failing) {
			throw new Error("Store API unavailable");
		}
		return { store: { settings: store.settings } };
	},
}));

const { default: robots } = await import("@/app/robots");

// Google's matching: a rule matches from the start of the path and query, and `*` stands for any run of characters.
const matches = (rule: string, url: string) =>
	new RegExp(`^${rule.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*")}`).test(url);

const groupsWith = async (settings: Record<string, unknown>, failing = false) => {
	store.settings = settings;
	store.failing = failing;
	const { rules } = await robots();
	return Array.isArray(rules) ? rules : [rules];
};

const groups = await groupsWith({});
const rules = groups.flatMap((group) => group.disallow ?? []);
const blocked = (url: string) => rules.some((rule) => matches(rule, url));

test("sort and filter URLs are kept from crawlers", () => {
	expect(blocked("/products?sort=price-asc")).toBe(true);
	expect(blocked("/products?page=2&sort=price-asc")).toBe(true);
	expect(blocked("/category/shoes?brand=acme")).toBe(true);
	expect(blocked("/products?priceMin=10&priceMax=50")).toBe(true);
	expect(blocked("/products?vts=size:m")).toBe(true);
});

test("listings, their pages and catalog paths stay crawlable", () => {
	expect(blocked("/products")).toBe(false);
	expect(blocked("/products?page=2")).toBe(false);
	expect(blocked("/category/shoes")).toBe(false);
	expect(blocked("/collection/summer")).toBe(false);
	expect(blocked("/product/sneaker?utm_source=newsletter")).toBe(false);
	expect(blocked("/products?resort=1")).toBe(false);
});

test("a store with no rules of its own prints only the store's group", () => {
	expect(groups).toHaveLength(1);
	expect(groups[0]?.userAgent).toBe("*");
});

test("the merchant's rules follow the store's own, which stay as they were", async () => {
	const withRules = await groupsWith({
		robotsRules: "User-agent: GPTBot\nDisallow: /\n\nSitemap: https://x.example",
	});
	expect(withRules).toEqual([...groups, { userAgent: ["GPTBot"], disallow: ["/"] }]);
});

test("a failed store read leaves the store's own rules in place", async () => {
	expect(await groupsWith({ robotsRules: "User-agent: GPTBot\nDisallow: /" }, true)).toEqual(groups);
});

import { expect, test } from "bun:test";

// lib/commerce asserts YNS_API_KEY at import time — stub it before the dynamic import.
process.env.YNS_API_KEY ??= "test-key";

const { default: robots } = await import("@/app/robots");

// Google's matching: a rule matches from the start of the path and query, and `*` stands for any run of characters.
const matches = (rule: string, url: string) =>
	new RegExp(`^${rule.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*")}`).test(url);

const { rules: groups } = robots();
const rules = (Array.isArray(groups) ? groups : [groups]).flatMap((group) => group.disallow ?? []);
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
